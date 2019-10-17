/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-16 15:20:31
 * @LastEditTime: 2019-08-16 15:41:45
 * @LastEditors: Please set LastEditors
 */
import {
    SRNStore,
    observable,
    action,
    SRNConfig,
    computed
} from '@souche-f2e/srn-framework';
import BLKSRNFetch from '../shared/utils/fetch'

import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';
import { HideVinNum } from '../shared/utils'
//配置查询接口
const APIConfig = {
    //车辆车型在库可售/在途可售车辆明细查询接口
    GetCarStockModelDetails: `${SRNConfig.pangolin}/pangolinEntrance/pageCarStockModelDetails.json`,
    //锁车
    MatchAndLockCar: `${SRNConfig.pangolin}/pangolinEntrance/matchAndLockCar.json`,
    //查询配置项
    GetConfigByCode: `${SRNConfig.pangolin}/pangolinEntrance/getConfigByCode.json`,
    
};
class InventoryVendibility extends SRNStore {
    /**
     * 所有车辆 
     * 
     * timeArea-每辆车锁定的30分钟倒计时
     */
   
    //isOrder-是否超期 isHide-是否隐藏，isShowH 正常库龄不可见  isShowR-超期库龄是否展示
    @observable allList = []
    //在库车辆
    @observable inStoreList = []
    //在途车辆
    @observable inTransitList = []
    @observable isShowAll = false//默认显示一条
    @observable isShowLockCarBtn = false//是否展示锁定车辆按钮
    @observable isShowLockedTips = false//是否展示锁定时间提示
    @observable lockDateTime = '' // 已锁车时间
    @observable timeArea = '' // 已锁车时间跟当前进行判断之后的结果
    @observable dataTime = 30  // 默认30分钟之后取消锁定
    // @observable isOrderDay = 120 //根据此字段判断是否超期，如果比此字段大说明超期
    @observable isSubmitBtn = true //是否可以点击锁定按钮
    @observable isPressSubmitBtn = false //是否点击了锁定按钮，用来判断返回上一页是否刷新页面
    @observable vinHideNum = 0 // vin码默认不隐藏
    @observable timer1 = '' //setInterval
    @observable timerTips = '' //setInterval 顶部倒计时
    @observable timer2 = '' //setTimeOut
    @observable refreshing = false //是否刷新
    @observable isFirst = false //是否初加载
    @observable mockData = [
        { isThirtyLock:false, timeArea: '', isShowR: false, isShowH: false, isHide: true , isOrder: true , vin: 'vin码1', storageLocation: '这是存放位置1', isLock: 0, lockDateStr: '', invStatusName: '在库', libraryAge: 1, estimatedArrival: '预计到店时间1' },
        { isThirtyLock:false, timeArea: '', isShowR: false, isShowH: false, isHide: true , isOrder: false, vin: 'vin码2', storageLocation: '这是存放位置2', isLock: 0, lockDateStr: '', invStatusName: '在库', libraryAge: 2, estimatedArrival: '预计到店时间2' },
        { isThirtyLock:false, timeArea: '', isShowR: false, isShowH: false, isHide: true , isOrder: false, vin: 'vin码3', storageLocation: '这是存放位置3', isLock: 0, lockDateStr: '', invStatusName: '在库', libraryAge: 3, estimatedArrival: '预计到店时间3' },
        { isThirtyLock:false, timeArea: '', isShowR: false, isShowH: false, isHide: true , isOrder: false, vin: 'vin码4', storageLocation: '这是存放位置4', isLock: 0, lockDateStr: '', invStatusName: '在库', libraryAge: 4, estimatedArrival: '预计到店时间4' },
        { isThirtyLock:false, timeArea: '', isShowR: false, isShowH: false, isHide: false, isOrder: false, vin: 'vin码5', storageLocation: '这是存放位置5', isLock: 0, lockDateStr: '', invStatusName: '在途', libraryAge: '', estimatedArrival: '预计到店时间5' },
    ]
    @action 
    mockDataChange(index,date){
        this.mockData.map((item, idx) => {
            if(index == idx){
                item.isThirtyLock = true
                item.lockDateStr = date
            }
        })
        this.getCarStockModelDetails()
    }
    //查询列表接口传参
    @observable
    resData = {
        carTypeCode: '',
        carModelName: '',
        carSeriesFilter: '',
        exteriorColor: '',
        exteriorColorName: '',
        interiorColor: '',
        interiorColorName: '',
    }
    //在库分页信息
    @observable pageInfo = {
        page: 1,
        pageSize: 100000,
    }

    @action 
    isPressSubmitBtnChange(data){
        this.isPressSubmitBtn = data
    }
    @action
    resDataChange(data) {
        this.resData = data
    }
    //展示全部
    @action
    showAllChange() {
        this.isShowAll = true
    }
    //清除定时器
    @action
    clearIntervalChange() {
        this.timer1 && clearInterval(this.timer1);
    }
    @action
    timerTipsClear(){
        this.timerTips && clearInterval(this.timerTips)
    }
    @action
    clearTimeoutChange() {
        this.timer2 && clearTimeout(this.timer2);
    }
    @action
    timeAreaChange(time) {
        this.timeArea = time
    }
    //锁车提示信息修改
    @action
    timeChange() {
        let lockDateTime = this.lockDateTime
        let dataTime = this.dataTime
        // 如果timeArea >= 0 说明已经过了锁车时间，解除锁定，否则提示锁定

        this.timerTips && clearInterval(this.timerTips)
        this.timerTips = setInterval(() => {
            let timeArea = new Date(lockDateTime).getTime() + dataTime* 60000 - (new Date().getTime())
            if (timeArea < 0 || isNaN(timeArea)) {
                clearInterval(this.timerTips)
                //清除定时器，显示按钮，隐藏tips
                this.isShowLockedTips = false
            } else {
                this.timeAreaChange(timeArea)
            }
        }, 1000)
    }
    //在库锁车倒计时
    @action
    timeChangeTime(){
        console.log(`调用锁定倒计时`)
        this.timer1 && clearInterval(this.timer1)
        let _th = this
        this.timer1 = setInterval(() => {
            //只要有一个锁车时间到就刷新数据
            let flag = false //默认已锁车
            let isALLUnLocked = false //默认全部锁车 ，用来判断清除定时器
            _th.inStoreList.map(item => {
                let timeArea = new Date(item.lockDateStr).getTime() + _th.dataTime* 60000 - (new Date().getTime())
                 if(timeArea < 0 || isNaN(timeArea)){
                    //当前行锁车时间到
                    item.timeArea = ''
                    item.isThirtyLock = false
                    flag = true
                }else{
                    //当前还在倒计时,
                    item.timeArea = timeArea
                    item.isThirtyLock = true
                    isALLUnLocked = true
                }
            })
            console.log(`正在执行倒计时`)
            if(flag){
                _th.isShowLockCarBtn = true
            }else{
                _th.isShowLockCarBtn = false
            }

            //如果全部已经解锁，清除倒计时
            if(!isALLUnLocked){
                console.log(`执行清除定时器`)
                _th.timer1 && clearInterval(_th.timer1)
            }
            
        }, 1000)
    }
    //锁车提示隐藏
    @action
    hideLockedTips() {
        this.timer2 && clearTimeout(this.timer2);
        let _th = this
        this.timer2 = setTimeout(() => {
            _th.isShowLockedTips = false
            _th.timerTips && clearInterval(_th.timerTips)
        }, 5000)
    }
    /**
     * 库龄点击查看
     * @param {number} index 当前选中的下标
     * @param {*} isAll 全部列表-true  在库列表-false
     * @param {*} tag 当前选中库龄展示的状态
     */
    @action
    lookLibraryAgeChange(index, tag) {
        let arr = this.inStoreList
        if (tag == 'isHide') {
            arr[index].isOrder ? arr[index].isShowR = true : arr[index].isShowH = true
            arr[index].isHide = false
        } else {
            arr[index].isShowR = false
            arr[index].isShowH = false
            arr[index].isHide = true
        }
        this.inStoreList = arr

    }
    //车辆车型在库可售/在途可售车辆明细查询
    @action
    getCarStockModelDetails(showTopTips) {
        let data = {
            ...this.pageInfo,
            ...this.resData
        }
        // this.refreshing = true
        BLKSRNFetch(APIConfig.GetCarStockModelDetails, {
            method: 'POST',
            json: data
        }).then(res => {
            this.isFirst = true
            this.refreshing = false
           console.log(res)
            if (res.items && Array.isArray(res.items)) {
                //模拟数据
                // let list = this.mockData || []
                let listInStore = []
                let listInTransit = []
                let list = res.items || []
                list.map(items => {
                    //处理vin码隐藏
                    items.vinHide = items.vin
                    if(this.vinHideNum && items.vin){
                        const HideVinNumRet = HideVinNum(items.vin, 0, items.vin.length - this.vinHideNum)
                        items.vinHide = HideVinNumRet
                    }
                    items.isShowR = false
                    items.isShowH = false
                    items.estimatedArrival = items.estimatedArrival.replace(/-/g, '/')
                   
                     //处理增配/前装数据
                     let ZPlist = [];
                     let QZlist = [];
                     items.installItemList && items.installItemList.map(item => {
                         item.typeName == '增配' && ZPlist.push(item)
                         item.typeName == '前装' && QZlist.push(item)
                     })
                     let ZPStr = Object
                     .keys(ZPlist || {})
                     .map(key => ZPlist[key].name)
                     .join('、')

                     let QZStr = Object
                     .keys(QZlist || {})
                     .map(key => QZlist[key].name)
                     .join('、')

                     items.ZPStr = ZPStr
                     items.QZStr = QZStr

                    //如果存在锁车时间进行筛选
                    items.lockDateStr = items.lockDateStr.replace(/-/g, '/') || ''
                    items.isThirtyLock = items.isLock == '1' ? true : false
                    let timeAREA = new Date(items.lockDateStr).getTime() + this.dataTime* 60000 - (new Date().getTime())
                    if(timeAREA < 0 || isNaN(timeAREA)){
                        //当前行锁车时间到
                        items.timeArea = ''
                    }else{ 
                        items.timeArea = timeAREA || ''
                    }
                   
                    if (items.invStatusName == '在库') {
                        items.isHide = true
                        items.isOrder = false
                        listInStore.push(items)
                    } else {
                        items.isHide = false
                        items.isOrder = false
                        listInTransit.push(items)
                    }
                })
                this.allList = list
                this.inStoreList = listInStore
                this.inTransitList = listInTransit

                //库龄查询配置项
                this.GetConfigByCodeLibraryAge({configCode: 'NEW_CAR_INV_AGE_DUE'})

                //如果所有的车辆都未锁车，清空倒计时，显示锁车按钮
                let isALLNoLocked = this.inStoreList.every(item => !item.isThirtyLock )
                if(isALLNoLocked){
                    this.isShowLockCarBtn = true
                    this.timer1 && clearInterval(this.timer1)
                    return 
                }
                //执行倒计时
                this.timeChangeTime()

                if(showTopTips){
                    //顶部倒计时提示
                    this.lockDateTime = new Date()
                    this.isShowLockedTips = true
                    this.hideLockedTips()
                    this.timeChange()
                } 
            }
        }).catch(error => {
            this.isFirst = true
            this.refreshing = false
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            });
        })
    }
    _onRefresh(){
        this.refreshing = true
        this.GetConfigByCode({configCode: 'NEW_CAR_VIN_HIDE'})
    }
    //锁车
    @action
    matchAndLockCar(data) {
        this.isSubmitBtn = false
        SRNNative.Loading.show();
        BLKSRNFetch(APIConfig.MatchAndLockCar, {
            method: 'POST',
            json: data
        }).then(res => {
            SRNNative.Loading.hide();
            this.isSubmitBtn = true
            SRNNative.toast({ text: `车辆已锁定` })
            //返回成功时,刷新数据
            this.getCarStockModelDetails({showTopTips: true})
            
            //点击锁车按钮标识
            this.isPressSubmitBtn = true

        }).catch((error) => {
            this.isSubmitBtn = true
            SRNNative.Loading.hide();
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            });
        })
    }
    //查询配置项
    @action 
    GetConfigByCode(params){
        SRNNative.Loading.show();
        BLKSRNFetch(APIConfig.GetConfigByCode,{
           method:'GET',
           data:params 
        }).then(res => {
            SRNNative.Loading.hide();
            this.getCarStockModelDetails()
            
            if(res && Array.isArray(res) && res.length > 0) {
                this.vinHideNum = res[0].settingValue || 0
            }
          
        }).catch(err => {
            console.log(err)
            this.refreshing = false
            SRNNative.Loading.hide();
            SRNNative.confirm({
                title: '提示',
                text: err.msg,
                rightButton: '确认'
            });
        })
    }
    //库龄配置查询
    @action 
    GetConfigByCodeLibraryAge(params){
        BLKSRNFetch(APIConfig.GetConfigByCode,{
           method:'GET',
           data:params 
        }).then(res => { 
            if(res && Array.isArray(res) && res.length > 0) {
                //库龄是否超期配置
                let ret =  res[0].settingValue
                if(this.allList.length > 0){
                    if(this.allList[0].invStatusName == '在库' ){
                        let first = this.allList[0].libraryAge
                        first- ret> 0 ? this.allList[0].isOrder = true : this.allList[0].isOrder = false
                    }
                    this.inStoreList.map(item => {
                        item.libraryAge - ret > 0 ? item.isOrder = true : item.isOrder = false
                    })
                }
            }

        }).catch(err => {
            console.log(err) 
            SRNNative.confirm({
                title: '提示',
                text: err.msg,
                rightButton: '确认'
            });
        })
    }

}

export default InventoryVendibility;