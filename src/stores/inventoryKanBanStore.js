/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 10:54:15
 * @LastEditTime: 2019-09-04 10:47:54
 * @LastEditors: Please set LastEditors
 */
import {
    SRNStore,
    observable,
    action,
    SRNConfig
} from '@souche-f2e/srn-framework';
import {
    BLKSRNFetch
} from '../shared/utils';
import SRNNative from '@souche-f2e/srn-native';


const selectColorItemMap = {
    "LABEL": 'label',
    "VALUE": 'value',
}
const filterMap = {
    "MODELCODE": 'modelCode',
    "CARBRANDFILTER": 'carBrandFilter',
    "CARSERIESFILTER": 'carSeriesFilter',
}
const sortMap = {
    "SORTFILED": 'sortFiled',
    "SORTBYDESCORASCE": 'sortByDescOrAsce',
}
const APIConfig = {
    // 车辆车型在库可售/在途可售数量查询接口
    getCarStockModelNumbers_API: `${SRNConfig.pangolin}/pangolinEntrance/getCarStockModelNumbers.json`, 
    // 热门车系
    getHotelCarTypes_API: `${SRNConfig.pangolin}/pangolinEntrance/listHotelCarTypeVOs.json`, 
}
class inventoryKanBanStore extends SRNStore {

    //热门车系骨架
    @observable isGetHotelCarTypes_API = false
    @action 
    isGetHotelCarTypes_APIChange(data){
        this.isGetHotelCarTypes_API = data
    }
    //列表页骨架
    @observable isTabListCopy = false
    //筛选结果页骨架
    @observable isTabList = false
    @action
    isTabListCopyChange(data){
        this.isTabListCopy = data
    }
    @action 
    isTabListChange(data){
        this.isTabList = data
    }

    // 页码
    @observable page = 1

    // 热门车系
    @observable tabBarList = [
        // { carSeriesName: '请问请问群无群无群无Q50', carSeriesCode: 'carModeCode' },
        // { carSeriesName: 'Q501', carSeriesCode: 'color' },
        // { carSeriesName: 'Q502', carSeriesCode: 'libraryAvailable' },
        // { carSeriesName: 'Q503', carSeriesCode: 'roadAvailable' },
    ]

    // 是否下拉
    @observable isRefreshing = false

    // 数据源
    @observable tabList = []
    // 数据源
    @observable tabListCopy = []

    //是否清楚定时器
    @observable time = null

    // 是否最后一页
    @observable IsLastPage = false

    // 数据源长度
    @observable tabListLength = 0

    // 加载图片 
    @observable whichPic =  1 

    // 是否显示吸顶 
    @observable isTopShow = false 

    @observable isTopShowCopy = false 

    // 搜索字段
    @observable searchValue = ''

    // 筛选字段
    @observable modelCode = ''
    //从新车行情跳转过来拿到modelCode 
    @observable linkModelCode = ''

    // 热门车系
    @observable hotSaleValue = ''

    // 视图距离顶部的高度
    @observable moveY = []

    @observable moveResultY = []

    @action
    linkModelCodeChange(data){
        this.linkModelCode = data
    }
    // 筛选字段改变
    @action
    filterChange(val) {
        this.modelCode = val
        this.searchValue = ''
        this.moveResultY = []
        this.changeTabList()
    }

    // 搜索
    @action
    getSearchValue(value) {
        this.searchValue = value
        this.modelCode = ''
        this.linkModelCode = ''
        this.moveResultY = []
        this.changeTabList()
    }

    // 热门车系接口
    @action
    getHotelCarTypes() {
        SRNNative.Loading.show({
            text: '加载中',
            icon:'waiting'
        }) 
        BLKSRNFetch(APIConfig.getHotelCarTypes_API, {
            method: 'POST',
            json: {}
        }).then(res => {
            this.isGetHotelCarTypes_API = true
            SRNNative.Loading.hide()
            res && Array.isArray(res) ? this.tabBarList = res : this.tabBarList = []
        }).catch(err => {
            this.isGetHotelCarTypes_API = true
            SRNNative.confirm({
                title: '提示',
                text: err.msg,
                rightButton: '确认',
            })
        })
    }

    // 热门车系切换
    @action
    hotSaleTog(value) {
        this.hotSaleValue = value
        this.linkModelCode = ''
        this._onRefresh()
    }

    // 吸顶显示
    @action
    changeTopSow(val){
        this.isTopShow = val
    }

    @action
    changeTopSowCopy(val){
        this.isTopShowCopy = val
    }

    // 车系列表接口 and 处理数据
    @action
    changeTabList() {
        this.moveResultY = []
        this.tabList = []
        SRNNative.Loading.show({
            text: '加载中',
            icon:'waiting'
        }) 
        // 下拉,搜索,筛选,排序 改变 初始化字段
        
        BLKSRNFetch(APIConfig.getCarStockModelNumbers_API, {
            method: 'POST',
            json: {
                globalSearch: this.searchValue,
                modelCode: this.modelCode,
                carSeriesFilter: ""
            }
        }).then(res => {
            this.isTabList = true
            this.isRefreshing = false
            let resData = res || []
            if(res.length > 0){
                resData.map(item1 => {
                    item1.carModelNumbers.map((item2, index2) => {
                        // 销售指导价转为万元
                        if(item2.salesGuidancePrice){
                            item2.salesGuidancePriceWan = ((item2.salesGuidancePrice - 0 )/10000 || 0 ).toFixed(2).replace(/(\d+?)(?=(\d{3})+(\.|$))/g,'$1,')
                        }
                        item2.carColorNumbers.map((item3, idx) => {
                            if (idx < 3) {
                                item3.isShow = true
                                item2.showText = ''
                            } else {
                                item3.isShow = false
                                item2.showText = '展开更多'
                            }
                            let colorRGP = new RegExp("^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$");
                            let result = colorRGP.test(item3.exteriorColor)
                            item3.isColorShow = result
                            if (item3.isLock) {
                                let date = new Date().getTime()
                                let halfTime = 30 * 60 * 1000
                                let arr = []
                                item3.lockDateStr = item3.lockDateStr.replace(/-/g, '/')
                                let oldTime = new Date(item3.lockDateStr).getTime()
    
                                if (halfTime + oldTime > date) {
                                    let residueTime = new Date(halfTime + oldTime - date)
                                    let mm = residueTime.getMinutes();
                                    let s = residueTime.getSeconds();
                                    arr.push(mm, s)
                                    item3.countDown = arr
                                    item3.countDownSeconds = residueTime
                                }
                            }
                        })
                    })
                })
            }else{
                this.isTopShowCopy = false
                this.whichPic = 2
            }
            SRNNative.Loading.hide()
           
            this.tabList = resData
            this.clockTimer()
        }).catch(err => {
            this.isTabList = true
            this.whichPic = 2
            this.isRefreshing = false
            SRNNative.confirm({
                title: '提示',
                text: err.msg,
                rightButton: '确认',
            })
        })
       

    }

    // 倒计时
    @action
    clockTimer() {
        this.timer && clearInterval(this.timer)
        this.timer = setInterval(() => {
            flag = false
            this.tabList.map((item1, idx1) => {
                item1.carModelNumbers.map((item2, idx2) => {
                    item2.carColorNumbers.map((item3, idx) => {
                        if (item3.isLock) {
                            let timeArea = new Date(item3.lockDateStr).getTime() + 30 * 60 * 1000 - new Date().getTime()
                            if (!isNaN(timeArea) && timeArea >= 0) {
                                // item3.isLock = true
                                item3.countDownSeconds = item3.countDownSeconds - 1000
                                flag = true //说明是有定时器
                            }else{
                                item3.isLock = false
                            } 
                        }
                    })
                })
            })
            !flag && clearInterval(this.timer)
        }, 1000)
    }
    @action
    clockTimerCopy() {
        this.timers && clearInterval(this.timers)
        this.timers = setInterval(() => {
            flag = false
            this.tabListCopy.map((item1, idx1) => {
                item1.carModelNumbers.map((item2, idx2) => {
                    item2.carColorNumbers.map((item3, idx) => {
                        if (item3.isLock) {
                            let timeArea = new Date(item3.lockDateStr).getTime() + 30 * 60 * 1000 - new Date().getTime()
                            if (!isNaN(timeArea) && timeArea >= 0) {
                                // item3.isLock = true
                                item3.countDownSeconds = item3.countDownSeconds - 1000
                                flag = true //说明是有定时器
                            }else{
                                item3.isLock = false
                            } 
                        }
                    })
                })
            })
            !flag && clearInterval(this.timers)
        }, 1000)
    }

    // 点击收起
    @action
    changeTabListNone(index1, index2) {
        this.tabList.map((item1, idx1) => {
            if (index1 == idx1) {
                item1.carModelNumbers.map((item2, idx2) => {
                    if (index2 == idx2) {
                        item2.carColorNumbers.map((item3, idx) => {
                            if (idx < 3) {
                                item3.isShow = true
                            } else {
                                item3.isShow = false
                            }
                            item2.showText = '展开更多'
                        })
                    }
                })
            }
        })
    }
    changeTabListNoneCopy(index1, index2) {
        this.tabListCopy.map((item1, idx1) => {
            if (index1 == idx1) {
                item1.carModelNumbers.map((item2, idx2) => {
                    if (index2 == idx2) {
                        item2.carColorNumbers.map((item3, idx) => {
                            if (idx < 3) {
                                item3.isShow = true
                            } else {
                                item3.isShow = false
                            }
                            item2.showText = '展开更多'
                        })
                    }
                })
            }
        })
    }

    // 点击展开更多
    @action
    changeTabListAll(index1, index2) {
        this.tabList.map((item1, idx1) => {
            if (index1 == idx1) {
                item1.carModelNumbers.map((item2, idx2) => {
                    if (index2 == idx2) {
                        item2.carColorNumbers.map((item3, idx) => {
                            item3.isShow = true
                            item2.showText = '收起'
                        })
                    }
                })
            }
        })
    }
    changeTabListAllCopy(index1, index2) {
        this.tabListCopy.map((item1, idx1) => {
            if (index1 == idx1) {
                item1.carModelNumbers.map((item2, idx2) => {
                    if (index2 == idx2) {
                        item2.carColorNumbers.map((item3, idx) => {
                            item3.isShow = true
                            item2.showText = '收起'
                        })
                    }
                })
            }
        })
    }

    // 下拉刷新
    @action
    _onRefresh() {
        this.moveY = []
        this.tabListCopy = []
        SRNNative.Loading.show({
            text: '加载中',
            icon:'waiting'
        }) 
        // 下拉,搜索,筛选,排序 改变 初始化字段
        
        BLKSRNFetch(APIConfig.getCarStockModelNumbers_API, {
            method: 'POST',
            json: {
                globalSearch: '',
                modelCode: '',
                modelCode:this.linkModelCode || '',
                carSeriesFilter: this.hotSaleValue
            }
        }).then(res => {
            this.isRefreshing = false
            let resData = res || []
            if(res.length > 0){
                resData.map(item1 => {
                    item1.carModelNumbers.map((item2, index2) => {
                        // 销售指导价转为万元
                        if(item2.salesGuidancePrice){
                            item2.salesGuidancePriceWan = ((item2.salesGuidancePrice - 0 )/10000 || 0 ).toFixed(2).replace(/(\d+?)(?=(\d{3})+(\.|$))/g,'$1,')
                        }
                        
                        item2.carColorNumbers.map((item3, idx) => {
                            if (idx < 3) {
                                item3.isShow = true
                                item2.showText = ''
                            } else {
                                item3.isShow = false
                                item2.showText = '展开更多'
                            }
                            let colorRGP = new RegExp("^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$");
                            let result = colorRGP.test(item3.exteriorColor)
                            item3.isColorShow = result
                            if (item3.isLock) {
                                let date = new Date().getTime()
                                let halfTime = 30 * 60 * 1000
                                let arr = []
                                item3.lockDateStr = item3.lockDateStr.replace(/-/g, '/')
                                let oldTime = new Date(item3.lockDateStr).getTime()
    
                                if (halfTime + oldTime > date) {
                                    let residueTime = new Date(halfTime + oldTime - date)
                                    let mm = residueTime.getMinutes();
                                    let s = residueTime.getSeconds();
                                    arr.push(mm, s)
                                    item3.countDown = arr
                                    item3.countDownSeconds = residueTime
                                }
                            }
                        })
                    })
                })
            }else{
                this.isTopShow = false
                this.whichPic = 2
            }
            SRNNative.Loading.hide()
            this.tabListCopy = resData
            this.isTabListCopy = true
            this.clockTimerCopy()
        }).catch(err => {
            this.isTabListCopy = true
            this.whichPic = 2
            this.isRefreshing = false
            SRNNative.confirm({
                title: '提示',
                text: err.msg,
                rightButton: '确认',
            })
        })
       
    }

    // 添加到moveY
    @action
    moveYAction(value){
        this.moveY.push(value)
        this.moveY = this.moveY.sort((a, b) => {
            return a.y - b.y
        })
    }
    @action
    moveResultYAction(value){
        this.moveResultY.push(value)
        this.moveResultY = this.moveResultY.sort((a, b) => {
            return a.y - b.y
        })
    }

    // 清空moveY
    @action
    moveYNull(){
        this.moveY = []
    }
    @action
    moveResultYNull( ){
        this.moveResultY = []
    }

    // 改变moveY
    @action
    moveYChange(arr){
        this.moveY = arr
    }
    @action
    moveResultYChange(arr){
        this.moveResultY = arr
    }
}

export default inventoryKanBanStore;