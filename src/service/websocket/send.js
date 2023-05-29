/* eslint-disable */
import '@/service/proto/proto_main.js';
import socketMgr from '@/service/websocket/websocket';
import { useSelector } from 'react-redux';


console.log(proto);
/**
 * 登录请求
 * @param { Object } msg
 * @returns
 */
export function login(msg) {
  // 登录信息打包
  let loginMsg = new proto.pc_logon_request();
  loginMsg.setUsername(msg.Account);
  loginMsg.setPassword(msg.Passwd);
  // 消息主体打包
  let mainPack = new proto.main_packet();
  // mainPack.setAccessPointId("")
  mainPack.setContent(loginMsg.serializeBinary());
  mainPack.setCheck('0');
  mainPack.setMessageType(proto.MessageType.PC_LOGON_REQUEST);
  mainPack.setOriginEntityId(); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime());
  socketMgr.send(mainPack.serializeBinary());
  console.log('成功发送登录信息', mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

/**
 * 请求所有装备信息
 * @returns 
 */
export function getReqEquipModelInfoAll() {
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent();
  mainPack.setCheck('0');
  mainPack.setMessageType(proto.MessageType.REQ_EQUIPMODEL_INFO_ALL);
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime());

  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

/**
 * 发送订阅表
 * @param { Array } msg 订阅表
 * @returns 打包后的主包
 */
export function sendSubscribeTable(msg) {
  // 登录信息打包
  let pcEntityRegister = new proto.pc_entity_register();
  pcEntityRegister.setSubscribeTable(msg);
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(pcEntityRegister.serializeBinary());
  mainPack.setCheck('0');
  mainPack.setMessageType(proto.MessageType.PC_ENTITY_REGISTER);
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime());
  // console.log(mainPack);
  socketMgr.send(mainPack.serializeBinary());
  // console.log('发送订阅表', mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

/**
 * 发送兵力部署数据
 * @param {*} param0 
 * @returns 
 */
export function ReqTaskInfo(msg) {

  let req_task_info = new proto.req_task_info();

  req_task_info.setTaskName(msg.task_name);
  req_task_info.setTaskConstructTime(msg.task_construct_time);
  req_task_info.setTaskWaveScale(msg.task_wave_scale);
  req_task_info.setTaskMissionId(msg.task_mission_id);
  req_task_info.setTaskTideType(msg.task_tide_type);
  req_task_info.setTaskAreaType(msg.task_area_type);

  // 打包地理位置数组 无法直接使用setxxAPI
  for (let i = 0; i < msg.task_area_info_list.length; i++) {
    let position = req_task_info.addTaskAreaInfo()
    position.setLatitude(msg.task_area_info_list[i].latitude)
    position.setLongitude(msg.task_area_info_list[i].longitude)
  }

  // 打包我方装备数组 无法直接使用setxxAPI
  for (let j = 0; j < msg.equipments_our.length; j++) {
    const element = msg.equipments_our[j];
    let ourEquips = req_task_info.addEquipmentsOur()
    ourEquips.setEquipmentModelId(element.equipment_model_id)

    let pos = new proto.position()
    pos.setLatitude(element.pos.latitude)
    pos.setLongitude(element.pos.longitude)
    ourEquips.setPos(pos)

    ourEquips.setEquipResourse(element.equip_resourse)
    ourEquips.setEquipWeapon(element.equip_weapon)
  }

  // 打包敌方装备数组 无法直接使用setxxAPI
  for (let k = 0; k < msg.equipments_enemy.length; k++) {
    const element = msg.equipments_enemy[k];
    let enemyEquips = req_task_info.addEquipmentsEnemy()
    enemyEquips.setEquipmentModelId(element.equipment_model_id)

    let pos = new proto.position()
    pos.setLatitude(element.pos.latitude)
    pos.setLongitude(element.pos.longitude)
    enemyEquips.setPos(pos)

    enemyEquips.setEquipResourse(element.equip_resourse)
    enemyEquips.setEquipWeapon(element.equip_weapon)
  }

  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_task_info.serializeBinary());
  mainPack.setCheck('0');
  mainPack.setMessageType(proto.MessageType.REQ_TASKINFO);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

/**
 * 请求全部COA序列数据
 * @param {Number} params 
 */
export function ReqCOAList(params) {

  let req_coa_list = new proto.req_coa_list()
  req_coa_list.setTaskId(params)

  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_coa_list.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_COALIST);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  console.log(`已发送COA请求${params}`);
  return mainPack.serializeBinary();
}

/**
 * 请求单条COA序列的详细数据
 * @param {Number} params 
 * @returns 
 */
export function ReqCOANet(params) {
  let req_coa_net = new proto.req_coa_net();
  req_coa_net.setCoaId(params);

  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_coa_net.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_COANET);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

/**
 * 请求数据库中所有的装备信息
 * @returns 
 */
export function reqEquipList() {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(1)
  req_db_general.setParams("")

  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求当前装备信息
export function reqCurrentEquipExMsg(params) {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(2)
  req_db_general.setParams(`${params}`)
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求活动定义
export function reqActivity() {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(3)
  req_db_general.setParams("")
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求任务模板
export function reqTaskTemplate() {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(4)
  req_db_general.setParams("")
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求任务模板-节点
export function reqTaskTemplateNode() {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(5)
  req_db_general.setParams("")
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求任务模板-边
export function reqTaskTemplateEdge() {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(6)
  req_db_general.setParams("")
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求装备搭载关系
export function reqEquipRelation() {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(7)
  req_db_general.setParams("")
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求可预置的装备类型
export function reqPresetEquipType() {
  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(8)
  req_db_general.setParams("")
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求特定任务模板-节点
export function reqTheTaskTemplateNode(params) {

  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(9)
  req_db_general.setParams(`${params}`)
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求特定任务模板-边
export function reqTheTaskTemplateEdge(params) {

  let req_db_general = new proto.req_db_general()
  req_db_general.setDataSourceId(10)
  req_db_general.setParams(`${params}`)
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}

//  请求有向无环图右侧的数据列表
export function reqDagString(params) {

  let req_dag_string = new proto.req_dag_string()
  req_dag_string.setDataSourceId(11)
  req_dag_string.setParams(`${params}`)
  // 消息主体打包
  const userID = useSelector(state => state.userID);
  let mainPack = new proto.main_packet();
  mainPack.setContent(req_db_general.serializeBinary());
  mainPack.setCheck("0");
  mainPack.setMessageType(proto.MessageType.REQ_DB_GENERAL);// 消息类型
  mainPack.setOriginEntityId(userID); // 登陆设备id
  mainPack.setOriginEntityType(proto.EntityType.FE_BROWSER); // 原始实体类型
  mainPack.setTime(new Date().getTime()); // 时间戳
  socketMgr.send(mainPack.serializeBinary());
  return mainPack.serializeBinary();
}