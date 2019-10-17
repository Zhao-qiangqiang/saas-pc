import {
    SRNStore,
    observable,
    action,
    SRNConfig,
} from '@souche-f2e/srn-framework';
import BLKSRNFetch from '../shared/utils/fetch'

import SRNNative from '@souche-f2e/srn-native';
import { HideVinNum } from '../shared/utils'
//配置查询接口
const APIConfig = {
    //车辆车型在库可售/在途可售车辆明细查询接口
    GetInvVinById: `${SRNConfig.pangolin}/pangolinEntrance/getInvVinById.json`,
    //锁车
    MatchAndLockCar: `${SRNConfig.pangolin}/pangolinEntrance/matchAndLockCar.json`,
    //获取角色列表
    GetAuthRoles: `${SRNConfig.pangolin}/pangolinEntrance/getAuthRoles.json`,
    //查询订单跳转链接
    GetOrderLink: `${SRNConfig.sasslin}/list/orderListAction/getOrderLink.json`,
    //解锁车辆
    UnLockCarInv: `${SRNConfig.pangolin}/pangolinEntrance/unLockCarInv.json`,
    //查询配置项
    GetConfigByCode: `${SRNConfig.pangolin}/pangolinEntrance/getConfigByCode.json`,
};

class inventoryCarDetailStore extends SRNStore {
    
    @observable detailListInfo = 
        {
            // testText:'测试数据',
        }
    //车辆详情信息

    //查询车辆明细参数
    @observable resData = {
        invId:''
    }
    //是否刷新数据
    @observable
    isLoading = false

    @observable isShowLockCarBtn = false//是否展示锁定车辆按钮
    @observable isShowUnLockCarBtn = false//是否展示解锁车辆按钮
    @observable isShowLockedTips = false//是否展示锁定车辆提示
    @observable lockDateTime = '' // 已锁车时间
    @observable timeArea = '' // 已锁车时间跟当前进行判断之后的结果
    @observable dataTime = 30  // 默认30分钟之后取消锁定
    @observable isOrderDay = 120 //根据此字段判断是否超期，如果比此字段大说明超期
    @observable isSubmitBtn = true //是否可以点击锁定按钮
    @observable isPressSubmitBtn = false //是否点击了锁定/解锁按钮，用来判断返回上一页是否刷新页面
    @observable isXSGW = false //默认不是销售顾问
    @observable timer1 = '' //setInterval
    @observable vinHideNum = 0 //vin码默认不隐藏
    @observable isInventoryVendibility = false //是否从在库/在途跳转过来

    @action
    vinHideNumChange(data){
        this.vinHideNum = data
    }
    @action
    isInventoryVendibilityChange(data){
        this.isInventoryVendibility = data
    }

    @action 
    resDataChange(data){
        this.resData = data
    }
    //清除定时器
    @action
    clearIntervalChange() {
        this.timer1 && clearInterval(this.timer1);
    }

    //改变锁定时间
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
        this.timer1 && clearInterval(this.timer1)
        this.timer1 = setInterval(() => {
            let timeArea = new Date(lockDateTime).getTime() + dataTime * 60000 - (new Date().getTime())
            if (timeArea < 0 || isNaN(timeArea)) {
                clearInterval(this.timer1)
                //清除定时器，查询数据

                //倒计时结束,刷新数据
                this.GetInvVinById()
            } else {
                this.timeAreaChange(timeArea)
            }
        }, 1000)
    }

    //车辆详情查询
    @action
    GetInvVinById() {
        this.isLoading = true
        const data = {
            ...this.resData
        }
        BLKSRNFetch(APIConfig.GetInvVinById, {
            method: 'GET',
            data: data
        }).then(res => {
            SRNNative.Loading.hide();
            this.isLoading = false
            if(res){
                //处理vin码隐藏
                res.vinHide = res.vin
                if(this.vinHideNum && res.vin && this.isInventoryVendibility){
                    const HideVinNumRet = HideVinNum(res.vin, 0, res.vin.length - this.vinHideNum)
                    res.vinHide = HideVinNumRet
                }
                //查询订单跳转链接
                if(res.lockOrderNo && res.lockType === '1'){
                    this.GetOrderLink({orderCode : res.lockOrderNo})
                }

                res.recDate = (res.recDate || '').replace(/-/g, '/')
                res.relDate = (res.relDate || '').replace(/-/g, '/')
                res.poDate = (res.poDate || '').replace(/-/g, '/')
                res.payDate = (res.payDate || '').replace(/-/g, '/')
                res.expectedDeliveryDate = (res.expectedDeliveryDate || '').replace(/-/g, '/')
                res.carMassLossDate = (res.carMassLossDate || '').replace(/-/g, '/')
                res.outFactoryDate = (res.outFactoryDate || '').replace(/-/g, '/')
                res.exInterestBearingDate = (res.exInterestBearingDate || '').replace(/-/g, '/')
                //处理增配/前装数据
                let ZPlist = [];
                let QZlist = [];
                res.installItemList.map(item => {
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

                res.ZPStr = ZPStr
                res.QZStr = QZStr

                this.detailListInfo = res  
                
                //如果订单已锁定，并且锁车时间超过30分钟以上，不显示锁车按钮,30分钟以内并且 showUnLock 显示解锁按钮
                if(res.showUnLock ==='1'){
                    this.isShowUnLockCarBtn = true
                }
                if(res.showUnLock ==='0'){
                    this.isShowUnLockCarBtn = false
                }
                //锁定日期
                if(res.isLock && res.lockDate){
                    res.lockDate = res.lockDate.replace(/-/g, '/')
                    this.lockDateTime = res.lockDate
                    //拿到日期倒计时计算
                    let timeArea = new Date(this.lockDateTime).getTime() + this.dataTime * 60000 - (new Date().getTime())
                    if (timeArea >= 0 && !isNaN(timeArea)) {
                        //显示tips,隐藏锁车按钮,显示计算时间差
                        this.isShowLockedTips = true
                        this.isShowLockCarBtn = false
                        this.timeChange()
                    }else{
                        this.isShowLockedTips = false
                        this.isShowLockCarBtn = false
                    }
                } else{
                    this.isShowLockedTips = false
                   
                     //未锁车进行锁车判断
                    if( res.invStatus != '在库' || res.showLock != '1' || (res.isLock &&  res.lockType != '2')){
                        this.isShowLockCarBtn = false
                    }else{
                        this.isShowLockCarBtn = true
                    }
                }
            } 
        }).catch(error => {
            SRNNative.Loading.hide();
            this.isLoading = false
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            });
        })
    }
    //锁车
    @action
    matchAndLockCar(data) {
        SRNNative.Loading.show();
        this.isSubmitBtn = false
        BLKSRNFetch(APIConfig.MatchAndLockCar, {
            method: 'POST',
            json: data
        }).then(res => {
            SRNNative.Loading.hide();
            SRNNative.toast({ text: `车辆已锁定` })
            this.isSubmitBtn = true
            //返回成功时,刷新数据
            this.GetInvVinById()
          
            //点击锁车/解锁按钮标识
            this.isPressSubmitBtn = true

        }).catch((error) => {
            SRNNative.Loading.hide();
            this.isSubmitBtn = true
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            });
        })
    }
    //解锁
    UnLockCarInv(data){
        SRNNative.Loading.show();
        this.isSubmitBtn = false
        BLKSRNFetch(APIConfig.UnLockCarInv,{
            method:'POST',
            json:data
        }).then(res => {
            SRNNative.Loading.hide();
            this.isSubmitBtn = true
            SRNNative.toast({ text: `车辆已解锁` })
            //返回成功时,刷新数据
            this.GetInvVinById()
            //点击锁车/解锁按钮标识
            this.isPressSubmitBtn = true
        }).catch( err => {
            SRNNative.Loading.hide();
            this.isSubmitBtn = true
            SRNNative.confirm({
                title: '提示',
                text: err.msg,
                rightButton: '确认'
            });
        })
    }
    //获取角色列表
    @action getAuthRoles(data) {
        BLKSRNFetch(APIConfig.GetAuthRoles, {
            method: 'POST',
            json: data
        }).then(res => {
            if(res && Array.isArray(res)){
                let isCLLBList = res.find(item => item.code == 'CAkanban')
                let isKCZLList = res.find(item => item.code == 'JITUANBAN-APP-jiugongge-NewCarInventory-InventoryAccount')
                 //非销售顾问不能锁车 
                if( isCLLBList){
                    this.isXSGW = true
                }
            }
        }).catch((error) => {
            
        });
    }
    //根据订单号查询跳转链接
    @action
    GetOrderLink(data){
        BLKSRNFetch(APIConfig.GetOrderLink,{
          method:'GET',
          data:data 
        }).then(res => {
            this.detailListInfo = {
                ...this.detailListInfo,
                orderLink:res
            }
        }).catch(error => {
             
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
            this.GetInvVinById()
            
            if(res && Array.isArray(res) && res.length > 0) {
                this.vinHideNum = res[0].settingValue || 0
            }
          
        }).catch(err => {
            console.log(err)
            SRNNative.Loading.hide();
            SRNNative.confirm({
                title: '提示',
                text: err.msg,
                rightButton: '确认'
            });
        })
    }
}



export default inventoryCarDetailStore;