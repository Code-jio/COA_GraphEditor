/* eslint-disable */
import { useDispatch } from 'react-redux';
import { sendSubscribeTable, login } from "./send.js"
import dataUnit from "./dataUnit"
import subscribeTable from '../../utils/subScribeTable.js';
import '../proto/proto_main.js';


let url = 'ws://172.16.100.83:20002';
let _socket;
// 没有服务器的前提下 用浏览器作为运行环境 寻找用于绘图的包
let SocketManager = (function () {

  let MessageType;
  /**
   * @lends module:SocketMgr
   * @class SocketMgr
   * @description websocket管理类
   * @constructs SocketMgr
   * @param {string} url websocket地址
   * @param {string} [protocol] 协议
   * @param {string} [binaryType] 二进制类型
   */
  let SocketManager = function () {
    this.connect = function () {
      console.log('wo---, 初次连接尝试');
      try {
        _socket = new WebSocket(url);
        _socket.binaryType = 'arraybuffer';
        // Message("成功创建websocket对象")
      } catch (error) {
        console.log(error);
        Message("连接失败，暂时无法连接")
      }
      _socket.onopen = this.onOpen.bind(this);
      _socket.onmessage = this.onMessage.bind(this);
      _socket.onclose = this.onClose.bind(this);
    };
    this.onOpen = function () {
      console.log('连接成功');
      login({ Account: 'test', Passwd: 'test' });
      MessageType = proto.MessageType;
    };
    // 消息接收
    this.onMessage = function ({ data }) {
      // console.log(data);
      if (!(data instanceof ArrayBuffer)) return;
      // let mainPacket = main_packet.decode(util.decodeBuffer(data));
      // new 主包解析
      let evt = new Uint8Array(data);
      let mainPack_Ser = proto.main_packet.deserializeBinary(evt);
      // 主包转化为解析度较高的对象形式
      let mainPacket = proto.main_packet.deserializeBinary(evt).toObject();
      // 获取主包中的内容（Arraybuffer格式）
      let content = mainPack_Ser.getContent();
      // 通过消息类型判断 再根据消息类型对主包内容进行解码
      console.log(mainPacket);
      const dispatch = useDispatch() // 创建dispatch方法
      switch (mainPacket.messageType) {
        // 登陆回应
        case MessageType.PC_LOGON_ASW:
          let pc_logon_asw = proto.pc_logon_asw
            .deserializeBinary(content)
            .toObject();

          // 判断登录是否成功
          if (pc_logon_asw.rst === true) {
            // 在此处存储登录的token信息

            dispatch(setUserID(pc_logon_asw.id))
            sendSubscribeTable(subscribeTable);  // 订阅数据表
            if (!window.localStorage) {
              alert('该设备不支持localstorage');
              return false;
            } else {
              localStorage.setItem(
                'usertoken',
                JSON.stringify(pc_logon_asw.token)
              );
            }
          } else {
            Message("登陆失败，请检查账号及密码")
            return
          }
          break;
        // 接收所有装备信息列表
        case MessageType.ACK_EQUIPMODEL_INFO_ALL:
          let equipmodel_info_all = proto.ack_equipmodel_info_all
            .deserializeBinary(content).toObject();
          dispatch(setEquipInfoListAll(equipmodel_info_all.infoAllList))
          break;
        // 接受测试地理数据
        case MessageType.TST_POSITIONS:
          let positionsList = proto.tst_positions
            .deserializeBinary(content).toObject();

          dispatch(setPositionsList(positionsList))
          break;
        // 接受COA序列列表
        case MessageType.ACK_COALIST:
          let ackCOAList = proto.ack_coa_list
            .deserializeBinary(content).toObject();
          console.log(ackCOAList, "接受COA序列列表");
          break;
        // 接受单条COA序列详细信息
        case MessageType.ACK_COANET:
          let ackCOANet = proto.ack_coa_net
            .deserializeBinary(content).toObject();
          console.log(ackCOANet, "接受单条COA序列详细信息");
          break;

        // 接受数据库中的数据表
        case MessageType.DB_GENERAL_TABLE:
          let db_general_table = proto.db_general_table
            .deserializeBinary(content).toObject();
          console.log(db_general_table, "test");
          dataUnit(db_general_table)
          break;

        // 接收有向无环图右侧的数据列表
        case MessageType.ACK_DAG_STRING:
          let ack_dag_string = proto.ack_dag_string
            .deserializeBinary(content).toObject();
          console.log(ack_dag_string, "接收有向无环图右侧的数据列表");
          break;
        // 默认
        default:
          console.log('未找到针对此消息的处理方式', mainPacket, content);
          break;
      }
    };
    // 关闭时
    this.onClose = function (event) {
      console.log('关闭了', event);
      // _socket = null;
    };
    // 消息发送
    this.send = function (args) {
      if (!_socket) {
        console.log('连接已关闭或者没有链接成功');
        Message('连接已关闭或者没有链接成功');
        _socket = null;
        return;
      }
      ;
      if (args) {
        _socket.send(args);
      }
    };
    // 强制关闭
    this.forceClose = function () {
      _socket.close(); // 主动关闭
      console.log('websocket已经关闭');
      _socket = null;
    };
  };

  let _me = null;
  return {
    get instance() {
      _me || (_me = new SocketManager());
      return _me;
    }
  };
})();
// q：这样写的好处是什么？ 
// a：单例模式，保证只有一个实例，节省内存空间
const a = SocketManager.instance;   // instance 有什么用？
a.connect(0, 0, 1);
// 以上代码是为了在页面加载时就建立连接，但是这样写的话，会导致在页面刷新时，连接会断开，所以需要在页面刷新时，重新建立连接
// 在页面刷新时，重新建立连接
window.onbeforeunload = function () {
  a.forceClose();// 关闭连接
  a.connect(0, 0, 1);// 重新建立连接
};


export default a;
