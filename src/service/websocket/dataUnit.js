/* eslint-disable */
import datasource from "../proto/dataSource.json"
import { useDispatch } from 'react-redux';

let dataSource = JSON.parse(JSON.stringify(datasource))

export default function dataUnit(data) {
    const dispatch = useDispatch() // 创建dispatch方法
    let id = data.dataSourceId
    let template
    switch (id) {
        // id = 1时，为所有装备信息
        case 1:
            let equipList = []
            data.dataRowList.forEach((element, i) => {
                equipList.push({
                    equip_model_id: element.valueList[0],
                    type_id: element.valueList[1],
                    name: element.valueList[2],
                    type_name: element.valueList[3],
                    area: element.valueList[4],
                    length: element.valueList[5],
                    width: element.valueList[6],
                    height: element.valueList[7],
                    speed_min: element.valueList[8],
                    speed_eva: element.valueList[9],
                    speed_max: element.valueList[10],
                })
            });

            dispatch(setEquipInfoListAll(equipList))

            return equipList;
        // id = 2时，为当前点击装备的扩展信息
        case 2:
            template = dataSource.dataSource[id - 1].column
            let EquipInfo_Ex = []

            data.dataRowList.forEach((element, i) => {
                EquipInfo_Ex.push({
                    property_id: element.valueList[0],
                    model_id: element.valueList[1],
                    property_name: element.valueList[2],
                    property_measure: element.valueList[3],
                    value_eva: element.valueList[4],
                    value_max: element.valueList[5],
                    value_min: element.valueList[6],
                })
            })
            dispatch(setCurrentEquipExtentInfo(EquipInfo_Ex))
            return
        // id = 3时，为当前点击装备的活动信息
        case 3:
            let activityList = []
            template = dataSource.dataSource[id - 1].column
            console.log(data);
            for (let i = 0; i < data.dataRowList.length; i++) {
                let activity = {};
                for (let j = 0; j < template.length; j++) {
                    activity[template[j].name] = data.dataRowList[i].valueList[j];
                }
                activityList.push(activity);
            }
            dispatch(setActivityList(activityList))
            return
        // id = 4时，为任务分解列表
        case 4:
            let taskList = []
            template = dataSource.dataSource[id - 1].column
            for (let i = 0; i < data.dataRowList.length; i++) {
                let task = {};
                for (let j = 0; j < template.length; j++) {
                    task[template[j].name] = data.dataRowList[i].valueList[j];
                }
                taskList.push(task);
            }
            dispatch(setTaskList(taskList))
            return
        // id = 5时，为任务模板-节点
        case 5:
            console.log(data);
            return
        // id = 6时，为任务模板-边
        case 6:
            console.log(data);
            return
        // id = 7时，为装备搭载关系
        case 7:
            console.log(data);
            return
        // id = 8时，为可预置的装备类型
        case 8:
            console.log(data);
            return
        // id = 9时，为特定任务模板的节点
        case 9:
            let nodeList = []
            template = dataSource.dataSource[id - 1].column
            for (let i = 0; i < data.dataRowList.length; i++) {
                let node = {};
                for (let j = 0; j < template.length; j++) {
                    node[template[j].name] = data.dataRowList[i].valueList[j];
                }
                nodeList.push(node);
            }
            dispatch(setTaskNodeList(nodeList))
            console.log(nodeList);
            console.log(data);
            return
        // id = 10时，为特定任务模板的边
        case 10:
            console.log(data);
            let edgeList = []
            template = dataSource.dataSource[id - 1].column
            for (let i = 0; i < data.dataRowList.length; i++) {
                let edge = {};
                for (let j = 0; j < template.length; j++) {
                    edge[template[j].name] = data.dataRowList[i].valueList[j];
                }
                edgeList.push(edge);
            }

            dispatch(setTaskEdgeList(edgeList))
            return
        default:
            break;
    }
}