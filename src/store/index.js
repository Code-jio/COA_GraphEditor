// 引入Redux
import { createSlice, configureStore } from '@reduxjs/toolkit'

// 创建User ID的slice
const userIDSlice = createSlice({
    name: 'userID',
    initialState: null,
    reducers: {
        setUserID: (state, action) => {
            state = action.payload
        }
    }
})
const { setUserID } = userIDSlice.actions

// 创建COA序列的slice
const COAListSlice = createSlice({
    name: 'COAList',
    initialState: [],
    reducers: {
        setCOAList: (state, action) => {
            state = action.payload
        }
    }
})
const { setCOAList } = COAListSlice.actions

// 当前数据
const currentDataSlice = createSlice({
    name: 'currentData',
    initialState: {},
    reducers: {
        setCurrentData: (state, action) => {
            state = action.payload
        }
    }
})
const { setCurrentData } = currentDataSlice.actions

// 所有装备列表（源数据）
const equipInfoListAllSlice = createSlice({
    name: 'equipInfoListAll',
    initialState: [],
    reducers: {
        setEquipInfoListAll: (state, action) => {
            state = action.payload
        }
    }
})
const { setEquipInfoListAll } = equipInfoListAllSlice.actions

// 按地区分类渲染的装备列表
const EquipList_TypeSlice = createSlice({
    name: 'EquipList_Type',
    initialState: [],
    reducers: {
        setEquipList_Type: (state, action) => {
            state = action.payload
        }
    }
})
const { setEquipList_Type } = EquipList_TypeSlice.actions

// 按类型渲染的装备列表
const EquipList_AreaSlice = createSlice({
    name: 'EquipList_Area',

    initialState: [],
    reducers: {
        setEquipList_Area: (state, action) => {
            state = action.payload
        }
    }
})
const { setEquipList_Area } = EquipList_AreaSlice.actions

// 位置列表
const positionsListSlice = createSlice({
    name: 'positionsList',
    initialState: [],
    reducers: {
        setPositionsList: (state, action) => {
            state = action.payload
        }
    }
})
const { setPositionsList } = positionsListSlice.actions

// 当前装备扩展信息
const currentEquipExtentInfoSlice = createSlice({
    name: 'currentEquipExtentInfo',
    initialState: [],
    reducers: {
        setCurrentEquipExtentInfo: (state, action) => {
            state = action.payload
        }
    }
})
const { setCurrentEquipExtentInfo } = currentEquipExtentInfoSlice.actions

// 活动列表
const activityListSlice = createSlice({
    name: 'activityList',
    initialState: [],
    reducers: {
        setActivityList: (state, action) => {
            state = action.payload
        }
    }
})
const { setActivityList } = activityListSlice.actions

// 当前活动
const currentActivitySlice = createSlice({
    name: 'currentActivity',
    initialState: [],
    reducers: {
        setCurrentActivity: (state, action) => {
            state = action.payload
        }
    }
})
const { setCurrentActivity } = currentActivitySlice.actions

// 任务列表
const taskListSlice = createSlice({
    name: 'taskList',
    initialState: [],
    reducers: {
        setTaskList: (state, action) => {
            state = action.payload
        }
    }
})
const { setTaskList } = taskListSlice.actions

// 节点列表
const nodeListSlice = createSlice({
    name: 'nodeList',
    initialState: [],
    reducers: {
        setNodeList: (state, action) => {
            state = action.payload
        }
    }
})
const { setNodeList } = nodeListSlice.actions

// 边列表
const edgeListSlice = createSlice({
    name: 'edgeList',
    initialState: [],
    reducers: {
        setEdgeList: (state, action) => {
            state = action.payload
        }
    }
})
const { setEdgeList } = edgeListSlice.actions


// 创建store
const store = configureStore({
    reducer: {
        userID: userIDSlice.reducer,
        COAList: COAListSlice.reducer,
        currentData: currentDataSlice.reducer,
        equipInfoListAll: equipInfoListAllSlice.reducer,
        EquipList_Type: EquipList_TypeSlice.reducer,
        EquipList_Area: EquipList_AreaSlice.reducer,
        positionsList: positionsListSlice.reducer,
        currentEquipExtentInfo: currentEquipExtentInfoSlice.reducer,
        activityList: activityListSlice.reducer,
        currentActivity: currentActivitySlice.reducer,
        taskList: taskListSlice.reducer,
        nodeList: nodeListSlice.reducer,
        edgeList: edgeListSlice.reducer
    }
})
// 导出store
export default store