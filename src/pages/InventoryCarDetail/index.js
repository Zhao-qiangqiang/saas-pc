import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Clipboard,
    RefreshControl
} from 'react-native';
import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';
import { SRNPage, observer, LifeCircle } from '@souche-f2e/srn-framework';
import { Color, loading } from '@souche-ui/srn-ui';

import inventoryCarDetailStore from '../../stores/inventoryCarDetailStore';
import { CarInfo, CarTag, stylesExample } from './component'

@observer
@loading
@LifeCircle
class InventoryCarDetail extends SRNPage {
    static navigation = {
        title: '车辆详情',
        headerStyle: {
            borderBottomColor: '#fff',
        },
        left: {
            showArrow: true,
            onPress(emitter) {
                emitter.emit('isRefreshFn')
            }
        },
    }
    constructor(props) {
        super(props);
        this.state = {

        };
        this.store = new inventoryCarDetailStore();
        this.lockCar = this.lockCar.bind(this)
        this.unLockCar = this.unLockCar.bind(this)
        this.copyClipboard = this.copyClipboard.bind(this)
        this._onRefresh = this._onRefresh.bind(this)

    }
    componentWillUnmount() {
        this.store.clearIntervalChange()
    }
    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.emitter.on('isRefreshFn', data => {
                //判断如果当前页面进行了锁定车辆操作并且是从在库/在途列表跳转过来的，回退到上一页进行刷新操作,
                const { parentStore } = this.props

                if (this.store.isPressSubmitBtn && parentStore) {
                    // 在库列表页刷新数据
                    parentStore.getCarStockModelDetails && parentStore.getCarStockModelDetails()
                    parentStore.isPressSubmitBtnChange && parentStore.isPressSubmitBtnChange(true)
                    //库存总览页刷新列表及统计
                    parentStore._refresh && parentStore._refresh()
                    parentStore.queryInventoryTab && parentStore.queryInventoryTab()

                }
                NavHelper.pop()
            })
            const {  invId = '', vinHideNum,isInventoryVendibility } = this.props
            //vin码的展示隐藏
            // vinHideNum && this.store.vinHideNumChange(vinHideNum)
            isInventoryVendibility && this.store.isInventoryVendibilityChange(isInventoryVendibility)

            this.store.resDataChange({ invId })
            //查询权限
            SRNNative.getAppData().then(res => {
                this.store.getAuthRoles({ token: res.userToken })
            })
        })

    }



    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            //查询车辆详情
            this.store.GetConfigByCode({configCode: 'NEW_CAR_VIN_HIDE'})
        });
    }
    //刷新数据
    _onRefresh() {
        this.store.GetInvVinById()
    }
    //复制vin码到剪切板
    copyClipboard(data) {
        Clipboard.setString(data || '');
        SRNNative.toast(`复制成功`)
    }
    //锁定车辆
    lockCar() {
        //如果存在可以锁车车辆
        const { isSubmitBtn, detailListInfo } = this.store
        SRNNative.bury('NCI-CaDashboard-Listing-Details-CarLocking', {});
        if (isSubmitBtn) {
            this.store.matchAndLockCar({
                vin: detailListInfo.vin || '',
                carSeriesFilter: detailListInfo.carSeriesCode || '',//车系code
                carTypeCode: detailListInfo.carModelCode || '', //车型code
                carModelName: detailListInfo.carModelName || '',
                exteriorColor: detailListInfo.carColorCode || '',//外饰色
                exteriorColorName: detailListInfo.carColorName || '',
                interiorColor: detailListInfo.carInnerColorCode || '', //内饰色
                interiorColorName: detailListInfo.innerColorName || '',
                lockType:'2'
            })
        }
    }
    //解锁车辆
    unLockCar(){
        const { isSubmitBtn, detailListInfo } = this.store
        if (isSubmitBtn) {
            this.store.UnLockCarInv({
                vin: detailListInfo.vin || '',
                carSeriesFilter: detailListInfo.carSeriesCode || '',//车系code
                carTypeCode: detailListInfo.carModelCode || '', //车型code
                carModelName: detailListInfo.carModelName || '',
                exteriorColor: detailListInfo.carColorCode || '',//外饰色
                exteriorColorName: detailListInfo.carColorName || '',
                interiorColor: detailListInfo.carInnerColorCode || '', //内饰色
                interiorColorName: detailListInfo.innerColorName || '',
            })
        }
    }

    render() {
        const { timeArea, isLoading,isXSGW,vinHideNum,isShowUnLockCarBtn,isInventoryVendibility,
            isShowLockCarBtn, isShowLockedTips, dataTime, detailListInfo } = this.store
        const carGuideAmount = ((detailListInfo.carGuideAmount - 0)/10000 || 0).toFixed(2).replace(/(\d+?)(?=(\d{3})+(\.|$))/g, '$1,')
        return (
            <View style={stylesExample.container}>
                {/* 锁定车辆时显示时间 */}
                {isShowLockedTips ?
                    <View style={stylesExample.lockedTips}>
                        <Text style={stylesExample.lockedTipsText}>
                            锁定中， {new Date(timeArea).getMinutes() < 10 ? ('0' + new Date(timeArea).getMinutes()) : (new Date(timeArea).getMinutes() ? new Date(timeArea).getMinutes() : '00')}分
                            {new Date(timeArea).getSeconds() < 10 ? ('0' + new Date(timeArea).getSeconds()) : (new Date(timeArea).getSeconds() ? new Date(timeArea).getSeconds() : '00')}秒后解锁
                    </Text>
                    </View> : null
                }
                <ScrollView automaticallyAdjustContentInsets={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    <View style={stylesExample.carModelStyle}>
                        <Text style={stylesExample.carModelNameStyle}>{detailListInfo.carModelName || '-'}</Text>
                        <Text style={stylesExample.colorStyle}>外观{detailListInfo.carColorName || '无'} | 内饰{detailListInfo.innerColorName || '无'} | {detailListInfo.massLossStatus || '-'}</Text>
                        <View style={stylesExample.priceView}>
                            <Text style={stylesExample.priceStyle}>销售指导价</Text>
                            <Text style={stylesExample.priceStyle}>{carGuideAmount}万</Text>
                        </View>

                        {/* 车辆信息标签 */}
                        <CarTag detailListInfo={detailListInfo} />
                        
                        {/* vin码展示 */}
                        <View style={stylesExample.vinStyle}>
                            <Text style={stylesExample.vinText}>VIN</Text>
                            <Text style={[stylesExample.vinNum, !detailListInfo.vin ? stylesExample.vinNumNone : '']}>
                                {detailListInfo.vinHide || '-'}
                            </Text>
                            <View style={stylesExample.copyView}>
                                {(detailListInfo.vin && !isInventoryVendibility) || (detailListInfo.vin && isInventoryVendibility && !vinHideNum) ?
                                    <TouchableOpacity onPress={this.copyClipboard.bind(this, detailListInfo.vin)}>
                                        <View style={stylesExample.copy}>
                                            <Text style={stylesExample.copyText}>复制</Text>
                                        </View>
                                    </TouchableOpacity> : null
                                }
                            </View>
                        </View>
                    </View>

                    {/* 车辆信息、库存信息、采购信息、订单信息 */}
                    <View style={{ backgroundColor: Color.White1, paddingLeft: 16, marginBottom: (isShowLockCarBtn && isXSGW) || isShowUnLockCarBtn ? 79 : 10 }}>
                        <CarInfo detailListInfo={detailListInfo} />
                    </View>
                </ScrollView>

                {/* 锁定车辆按钮 已经有锁定车时，不展示,当倒计时结束时展示， */}
                {isShowLockCarBtn && isXSGW ?
                    <View style={stylesExample.lockCarStyle}>
                        <Text style={stylesExample.lockCarTip}>锁车只可锁定{dataTime}分钟，按库龄自动锁定</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.lockCar}>
                            <View style={stylesExample.lockCarView}>
                                <Text style={stylesExample.lockCarText}>锁定车辆</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : null
                }
                {/* 解锁按钮 */}
                {isShowUnLockCarBtn ?
                    <View style={stylesExample.lockCarStyle}>
                        <Text style={stylesExample.lockCarTip}>
                            车辆已锁定，剩余{new Date(timeArea).getMinutes() < 10 ? ('0' + new Date(timeArea).getMinutes()) : (new Date(timeArea).getMinutes() ? new Date(timeArea).getMinutes() : '00')}分
                            {new Date(timeArea).getSeconds() < 10 ? ('0' + new Date(timeArea).getSeconds()) : (new Date(timeArea).getSeconds() ? new Date(timeArea).getSeconds() : '00')}秒解锁，请带客户尽快付款
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.unLockCar}>
                            <View style={stylesExample.lockCarView}>
                                <Text style={stylesExample.lockCarText}>解锁车辆</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : null
                }

            </View>
        );
    }
}


export default InventoryCarDetail;
