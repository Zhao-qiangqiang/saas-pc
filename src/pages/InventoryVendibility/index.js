import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    RefreshControl,
    InteractionManager,
    Image,
    PixelRatio,
} from 'react-native';
import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';
import { SRNPage, observer, LifeCircle } from '@souche-f2e/srn-framework';
import _ from 'lodash';
import { Color, loading, Icon, theme } from '@souche-ui/srn-ui';

import inventoryVendibilityStore from '../../stores/InventoryVendibility';
import { VendibilitySkeleton } from '../../components/skeleton'
const windoWidth = Dimensions.get('window').width;
const windoHeight = Dimensions.get('window').height;

@observer
@loading
@LifeCircle
class InventoryVendibility extends SRNPage {
    static navigation = {
        title: '标题',
        headerStyle: {
            borderBottomColor: '#fff',
        },
        left: {
            showArrow: true,
            onPress(emitter) {
                emitter.emit('isRefreshFn', { isRefresh: true })
            }
        },
    }
    constructor(props) {
        super(props);
        this.state = {

        };
        this.store = new inventoryVendibilityStore();
        this.lockCar = this.lockCar.bind(this)
        this.showAll = this.showAll.bind(this)
        this.lookLibraryAge = this.lookLibraryAge.bind(this)
        this.goDetail = this.goDetail.bind(this)
        this._onRefresh = this._onRefresh.bind(this)

    }
    componentWillUnmount() {
        this.store.clearIntervalChange()
        this.store.timerTipsClear()
        this.store.clearTimeoutChange()
    }
    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.emitter.on('isRefreshFn', data => {
                //判断如果当前页面进行了锁定车辆操作，回退到上一页进行刷新操作
                const { parentStore } = this.props

                if (this.store.isPressSubmitBtn) {
                    parentStore.changeTabList && parentStore.changeTabList()
                    parentStore._onRefresh && parentStore._onRefresh()
                    parentStore.changeTopSow && parentStore.changeTopSow(false)
                    parentStore.changeTopSowCopy && parentStore.changeTopSowCopy(false)
                    //选择之后骨架屏展示
                    parentStore.isTabListCopyChange && parentStore.isTabListCopyChange(false)
                    parentStore.isTabListChange && parentStore.isTabListChange(false)
                }
                NavHelper.pop()
            })


            const { resData } = this.props
            this.store.resDataChange({
                ...this.store.resData,
                ...resData
            })
            // this.store.getCarStockModelDetails()
            this.store.GetConfigByCode({configCode: 'NEW_CAR_VIN_HIDE'})
            this.setNavigation({
                title: {
                    component: ({ emitter, sceneProps }) => {
                        return (
                            <View style={stylesExample.searchHeader}>
                                <Text style={stylesExample.carModelNameStyle}
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                >
                                    {resData && resData.carModelName ? resData.carModelName : '-'}
                                </Text>
                                <Text style={stylesExample.carColorStyle}>
                                    外观：{resData && resData.exteriorColorName ? resData.exteriorColorName : '-'}
                                    {' '}{' '}
                                    内饰：{resData && resData.interiorColorName ? resData.interiorColorName : '-'}
                                </Text>
                            </View>
                        );
                    }
                }
            });

        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

        });
    }
    //跳转到车辆详情
    goDetail(item, index) {
        const { vinHideNum } = this.store
        NavHelper.push('/InventoryCarDetail',{
            invId:item.invId || '',
            parentStore:this.store,
            isInventoryVendibility:true,
            vinHideNum, //vin码配置项，控制vin码的显示隐藏
        })
    }
    //锁定车辆
    lockCar() {
        SRNNative.bury('NCI-CaDashboard-Listing-CarLocking', {});

        // const dateTest = new Date()
        // let { mockData } = this.store
       
        // let lockVin =  mockData.findIndex(item =>item.invStatusName == '在库' && !item.isThirtyLock && !item.timeArea)
        // if(lockVin < 0){
        //     //说明已经全部锁定
        // }
        // console.log(lockVin)
        // this.store.mockDataChange(lockVin, dateTest)

        // return 
        const { resData } = this.props
        const { isSubmitBtn, inStoreList } = this.store
        let lockVin =  inStoreList.findIndex(item => !item.isThirtyLock)
        if(lockVin < 0){
            //说明已经全部锁定
            SRNNative.toast({ text: `暂无可锁定车辆，请刷新数据后重试` })
            return 
        }

        if (lockVin > -1 && isSubmitBtn) {
            this.store.matchAndLockCar({
                vin: inStoreList[lockVin].vin || '',
                lockType:'2',
                ...resData
            })
        }
    }
    //库龄查看
    lookLibraryAge(index, tag) {
        this.store.lookLibraryAgeChange(index, tag)
    }
    //显示全部
    showAll() {
        this.store.showAllChange()
    }
    _onRefresh(){ 
        this.store._onRefresh() 
    }
    render() {
        const { isShowAll, allList, inStoreList, inTransitList, timeArea,refreshing,isFirst,
            isShowLockCarBtn, isShowLockedTips, dataTime } = this.store
        /**
         * 库龄展示不同状态
         * @param {*} index 当前点击的下标
         * @param {*} flag 是否为全部， true-全部列表，false-在售列表
         * @param {*} tag isShowH-库龄正常可见 isHide-库龄正常不可见 isShowR-库龄超期可见
         * @param {*} item 当前选中的数据
         */
        const getLookLibraryAge = (index, tag, item) => {
            return (
                <TouchableOpacity activeOpacity={0.8} onPress={this.lookLibraryAge.bind(this, index, tag)}>
                    {tag == 'isShowH' ?
                        <View style={stylesExample.eyeStyle}>
                            <Text style={stylesExample.lastStyle}>库龄：{item.libraryAge || '-'}天</Text>
                            <Image
                                style={{ width: 14, height: 14, marginLeft: 9, }}
                                source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/showH_2x.png' }}
                            />
                        </View> : null
                    }
                    {tag == 'isHide' ?
                        <View style={stylesExample.eyeStyle}>
                            <Text style={stylesExample.lastStyle}>库龄：****</Text>
                            <Image
                                style={{ width: 14, height: 14, marginLeft: 9, }}
                                source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/hide_2x.png' }}
                            />
                        </View> : null
                    }
                    {tag == 'isShowR' ?
                        <View style={stylesExample.eyeStyle}>
                            <Text style={stylesExample.overdueInventoryStyle}>库龄：{item.libraryAge || '-'}天，已超期</Text>
                            <Image
                                style={{ width: 14, height: 14, marginLeft: 9, }}
                                source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/showR_2x.png' }}
                            />
                        </View> : null
                    }
                </TouchableOpacity>
            )
        }
        return (
            <View style={stylesExample.container}>
                {/* 锁定车辆时显示时间 */}
                { isShowLockedTips ? 
                    <View style={[stylesExample.lockedTips ]}>
                    <Text style={stylesExample.lockedTipsText}>
                        车辆已锁定，剩余{new Date(timeArea).getMinutes() || '0'}分{new Date(timeArea).getSeconds() || '0'}秒解锁，请带客户尽快付款
                    </Text>
                    </View> : null
                }
                { !isFirst ?
                    <View>
                        <VendibilitySkeleton />
                    </View> :
                <ScrollView 
                    automaticallyAdjustContentInsets={false}
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={this._onRefresh}
                        />
                    }
                >
                    <View style={{ marginBottom: isShowLockCarBtn ? 79 : 10 }}>
                        {/* 只有一个时展示 */}
                        {!isShowAll && allList.length > 0 ?
                            <View>
                                { !isShowLockedTips ?
                                <View style={stylesExample.onlyOneView}>
                                    <Text>{' '}</Text>
                                </View> : null
                                }
                                <View style={stylesExample.listViewStyle}>
                                    <View style={[stylesExample.listStyle, stylesExample.listLastStyle]}>
                                         <View style={stylesExample.listCardStyle}>
                                            <Text style={stylesExample.vinStyle}>VIN：
                                                { inStoreList.length > 0 ? (`${inStoreList[0].vinHide}` || '暂无') :
                                                 (inTransitList.length > 0 && inTransitList[0].vinHide ? `${inTransitList[0].vinHide}` : '暂无')
                                                }
                                            </Text>
                                            { inStoreList.length > 0 ?
                                                <Text style={stylesExample.middleStyle}>存放位置：{inStoreList[0].storageLocation || '-'}</Text> : null
                                            }
                                            { inStoreList.length <= 0 && inTransitList.length > 0 ? 
                                                <Text style={stylesExample.lastStyle}>预计到店时间：{inTransitList[0].estimatedArrival || '-'}</Text> : null
                                            }
                                            { inStoreList.length > 0 && inStoreList[0].isShowH ? getLookLibraryAge(0, 'isShowH', inStoreList[0]) : null}
                                            { inStoreList.length > 0 && inStoreList[0].isHide ? getLookLibraryAge(0, 'isHide', inStoreList[0]) : null}
                                            { inStoreList.length > 0 && inStoreList[0].isShowR ? getLookLibraryAge(0, 'isShowR', inStoreList[0]) : null}

                                            { inStoreList.length > 0 && inStoreList[0].ZPStr ?
                                                <Text style={stylesExample.ZPStrStyle}>增配：{inStoreList[0].ZPStr || '-'}</Text> : null
                                            }
                                            {inStoreList.length > 0 && inStoreList[0].QZStr ?
                                                <Text style={stylesExample.ZPStrStyle}>前装：{inStoreList[0].QZStr || '-'}</Text> : null
                                            }
                                            {/* 是否已经锁定 判断当前的 isThirtyLock 是否已经锁定，如果已经锁定,展示当前倒计时 */} 
                                            {  inStoreList.length > 0 && inStoreList[0].isThirtyLock &&  inStoreList[0].timeArea ?
                                                <View style={stylesExample.onLockViewStyle}>
                                                    <Text style={stylesExample.onLockStyle}>
                                                        锁定中 {new Date(inStoreList[0].timeArea).getMinutes() < 10 ? ('0' + new Date(inStoreList[0].timeArea).getMinutes()) : new Date(inStoreList[0].timeArea).getMinutes()}分
                                                        {new Date(inStoreList[0].timeArea).getSeconds() < 10 ? ('0' + new Date(inStoreList[0].timeArea).getSeconds()) : new Date(inStoreList[0].timeArea).getSeconds()}秒
                                                    </Text>
                                                </View> : null
                                            }
                                        </View>
                                        <TouchableOpacity activeOpacity={0.8} onPress={this.goDetail.bind(this, allList[0], 0)}>
                                            <View style={stylesExample.arrowIconStyle}>
                                                    <View style={stylesExample.arrowIcon}>
                                                        <Icon type="angleRight" size="md" />
                                                    </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={allList.length == 1 ? [stylesExample.showAllStyle, stylesExample.displayNone] : [stylesExample.showAllStyle]} >
                                    <TouchableOpacity activeOpacity={0.8} onPress={this.showAll}>
                                        <View style={stylesExample.showAllView}>
                                            <Text style={stylesExample.showAllTextStyle} onPress={this.showAll}>显示全部</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View> : null
                        }
                        {/* 展示全部 */}
                        {isShowAll && inStoreList.length > 0 ?
                            <View>
                                <View style={stylesExample.totalNumView}>
                                    <Text style={stylesExample.totalNumStyle}>在库可售({inStoreList.length})</Text>
                                </View>
                                {inStoreList.map((item, index) => {
                                    return (
                                        <View style={stylesExample.listViewStyle} key={index}>
                                            <View style={index < (inStoreList.length - 1) ?
                                                [stylesExample.listStyle, stylesExample.listNormalStyle] : [stylesExample.listStyle, stylesExample.listLastStyle]}
                                            >
                                                <View style={stylesExample.listCardStyle}>
                                                    <Text style={stylesExample.vinStyle}>VIN：{item.vinHide || '暂无'}</Text>
                                                    <Text style={stylesExample.middleStyle}>存放位置：{item.storageLocation || '-'}</Text>

                                                    {item.isShowH ? getLookLibraryAge(index, 'isShowH', item) : null}
                                                    {item.isHide ? getLookLibraryAge(index, 'isHide', item) : null}
                                                    {item.isShowR ? getLookLibraryAge(index, 'isShowR', item) : null}
                                                    {item.ZPStr ?
                                                        <Text style={stylesExample.ZPStrStyle}>增配：{item.ZPStr || '-'}</Text> : null
                                                    }
                                                    {item.QZStr ?
                                                        <Text style={stylesExample.ZPStrStyle}>前装：{item.QZStr || '-'}</Text> : null
                                                    }
                                                    {/* 是否已经锁定 */}
                                                    { item.isThirtyLock && item.timeArea ? 
                                                        <View style={stylesExample.onLockViewStyle}>
                                                            <Text style={stylesExample.onLockStyle}>
                                                                锁定中 {new Date(item.timeArea).getMinutes() < 10 ? ('0' + new Date(item.timeArea).getMinutes()) : new Date(item.timeArea).getMinutes()}分
                                                                {new Date(item.timeArea).getSeconds() < 10 ? ('0' + new Date(item.timeArea).getSeconds()) : new Date(item.timeArea).getSeconds()}秒
                                                            </Text>
                                                        </View> : null
                                                    }
                                                </View>
                                                <TouchableOpacity activeOpacity={0.8} onPress={this.goDetail.bind(this, item, index)}>
                                                    <View style={stylesExample.arrowIconStyle}>
                                                            <View style={stylesExample.arrowIcon}>
                                                                <Icon type="angleRight" size="md" />
                                                            </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View> : null
                        }

                        {isShowAll && inTransitList.length > 0 ?
                            <View>
                                <View style={stylesExample.totalNumView}>
                                    <Text style={stylesExample.totalNumStyle}>在途可售({inTransitList.length})</Text>
                                </View>
                                {inTransitList.map((item, index) => {
                                    return (
                                        <View style={stylesExample.listViewStyle} key={index}>
                                            <View style={index < (inTransitList.length - 1) ?
                                                [stylesExample.listStyle, stylesExample.listNormalStyle] : [stylesExample.listStyle, stylesExample.listLastStyle]}
                                            >
                                                <View style={stylesExample.listCardStyle}>
                                                    <Text style={stylesExample.vinStyle}>VIN：{item.vinHide || '暂无'}</Text>
                                                    {/* <Text style={stylesExample.middleStyle}>存放位置：{item.storageLocation || '-'}</Text> */}
                                                    <Text style={stylesExample.lastStyle}>预计到店时间：{item.estimatedArrival || '-'}</Text>
                                                    {item.ZPStr ?
                                                        <Text style={stylesExample.ZPStrStyle}>增配：{item.ZPStr || '-'}</Text> : null
                                                    }
                                                    {item.QZStr ?
                                                        <Text style={stylesExample.ZPStrStyle}>前装：{item.QZStr || '-'}</Text> : null
                                                    }
                                                </View>
                                                <TouchableOpacity activeOpacity={0.8} onPress={this.goDetail.bind(this, item, index)}>
                                                    <View style={stylesExample.arrowIconStyle}>
                                                            <View style={stylesExample.arrowIcon}>
                                                                <Icon type="angleRight" size="md" />
                                                            </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View> : null
                        }
                    </View>
                    {/* 无数据时展示 */}
                    {allList.length <= 0 ?
                        <View style={stylesExample.imgStyle}>
                            <Image style={{
                                width: 144,
                                height: 144,
                                marginTop: 80
                            }}
                                source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/empty-car.png' }} />
                            <Text style={stylesExample.noListStyle}>暂无车辆</Text>
                        </View> : null
                    }
                </ScrollView>
                }
                {/* 锁定车辆按钮 已经有锁定车时，不展示,当倒计时结束时展示， */}
                {isShowLockCarBtn && inStoreList.length > 0 ?
                    <View style={stylesExample.lockCarStyle}>
                        <Text style={stylesExample.lockCarTip}>锁车只可锁定{dataTime}分钟，按库龄自动锁定</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.lockCar}>
                            <View style={stylesExample.lockCarView}>
                                <Text style={stylesExample.lockCarText}>锁定车辆</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : null
                }

                
            </View>
        );
    }
}

const stylesExample = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme('color_background_page')
    },
    detail: {
        padding: 16,
        paddingBottom: 0,
        backgroundColor: Color.White1
    },
    imgStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Color.White1,
        height: '100%',
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#00000033',
        marginBottom: 8
    },
    noListStyle: {
        fontSize: 16,
        color: '#1B1C33',
    },
    carModelNameStyle: {
        fontSize: 14,
        color: '#1B1C33',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    carColorStyle: {
        fontSize: 12,
        color: '#8D8E99',
        marginBottom: 7,
    },
    searchHeader: {
        paddingHorizontal: 30,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockCarStyle: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: Color.White1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 7,
        paddingTop: 8,
        paddingHorizontal: 16,

    },
    lockCarTip: {
        color: '#8D8E99',
        fontSize: 12,
        paddingBottom: 8,
    },
    lockCarView: {
        backgroundColor: '#FF571A',
        borderRadius: 20,
        width: 343,
        paddingVertical: 12,
    },
    lockCarText: {
        color: '#fff',
        fontSize: 16,
        alignSelf: 'center',
    },
    onLockViewStyle: {
        backgroundColor: '#FF571A',
        borderRadius: 2,
        width: 110,
        marginTop: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    onLockStyle: {
        fontSize: 12,
        color: '#fff',
    },
    lockedTips: {
        width: windoWidth,
        // position: 'absolute',
        // top: 0,
        // left: 0,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#1b1c33',
        // zIndex: 9999,
        opacity: 0.9
    },
    lockedTipsText: {
        color: '#fff',
        fontSize: 14
    },
    totalNumView: {
        paddingLeft: 16,
        paddingTop: 16,
        paddingBottom: 8
    },
    totalNumStyle: {
        fontSize: 14,
        color: '#999999',
    },
    listViewStyle: {
        paddingLeft: 16,
        backgroundColor: Color.White1,
    },
    listStyle: {
        paddingTop: 16,
        paddingBottom: 18,
        borderBottomWidth: 1 / PixelRatio.get(),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    listNormalStyle: {
        borderBottomColor: '#DCDCDC'
    },
    listLastStyle: {
        borderBottomColor: '#fff',
    },
    vinStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1B1C33',
        marginBottom: 16
    },
    middleStyle: {
        color: '#5E5E66',
        fontSize: 12,
        marginBottom: 9
    },
    lastStyle: {
        color: '#5E5E66',
        fontSize: 12,
    },
    ZPStrStyle: {
        color: '#5E5E66',
        fontSize: 12,
        marginTop: 9
    },
    overdueInventoryStyle: {
        color: '#FF4040',
        fontSize: 12,
    },
    eyeStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlyOneView: {
        height: 12
    },
    showAllStyle: {
        width: windoWidth,
        alignItems: 'center',
    },
    displayNone: {
        display: 'none',
    },
    showAllTextStyle: {
        color: '#8D8E99',
        fontSize: 12,
    },
    showAllView:{
        paddingVertical:12,
        paddingHorizontal:12,
    },
    arrowIcon:{
        
    },
    arrowIconStyle:{
        // backgroundColor:'red',
        flex:2,
        paddingRight: 16,
        paddingLeft:40,
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center',
        height:'100%'
    },
    
    listCardStyle:{
        // backgroundColor:'pink',
        flex:3
    }
});
export default InventoryVendibility;
