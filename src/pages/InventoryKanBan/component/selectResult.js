import React from 'react';

import { UIManager, findNodeHandle, SectionList, Easing, Animated, StyleSheet, View, Text, ScrollView, PixelRatio, TouchableOpacity, InteractionManager, Image, FlatList, RefreshControl, Dimensions } from 'react-native';
import {
    SRNPage,
    observer,
    LifeCircle,
    SRNConfig
} from '@souche-f2e/srn-framework';
import { Icon, } from '@souche-ui/srn-ui';

import _ from 'lodash';
import NavHelper from '@souche-f2e/srn-navigator';
// import inventoryKanBanStore from '../../stores/inventoryKanBanStore';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@LifeCircle
@observer
class InventoryKanBan extends SRNPage {
    static navigation = {
        title: {
            component: ({ emitter, sceneProps }) => {
                return (
                    <View style={styles.searchHeader}>
                        <Text style={{color:'#1A1A1A',fontSize:16,fontWeight:'bold'}}>筛选结果</Text>
                    </View>
                );
            },
        },
        headerStyle: { borderBottomColor: '#FFFFFF' },
        left: {
            showArrow: true,
        },
    }

    constructor(props) {
        super(props);
        // this.props.this.props.store = new inventoryKanBanStore()
        this.state = {
            hotSaleChoosed: null,
            refreshing: false, // 是否下拉
            moveResultY: [], // 滑动距离
            hotHSaleHeight: 0, // 动态获取热门车系高度
            currentIndex: 0, // 点击某个车型的查看更多
            carSeierName: '',  // 吸顶的车系
            onTopHeight: 0, // 吸顶的view 高度
            colorTest:'/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/'
        }

    }

    componentWillMount() {
       
    }
  
    // 展开更多 收起
    clickMore(value, index1, index2) {
        const { moveResultY } = this.props.store
        this.setState({
            currentIndex: index1,
        })
        if (index1 == 0) {
            this.props.store.moveResultYNull()
           
        } else {
            const arr = moveResultY.slice(0, index1)
            this.props.store.moveResultYChange(arr)
           
        }

        if (value == "展开更多") {
            this.props.store.changeTabListAll(index1, index2)
            
        } else {
            this.props.store.changeTabListNone(index1, index2)
        }

    }

    // 点击颜色跳转
    goDetail(carSeriesFilter, carTypeCode, carModelName, exteriorColor, exteriorColorName, interiorColor, interiorColorName) {
        const { store } = this.props
        NavHelper.push("/InventoryVendibility", {
            resData: {
                carSeriesFilter,//车系code
                carTypeCode, //车型code
                carModelName,
                exteriorColor,//外饰色
                exteriorColorName,
                interiorColor, //内饰色
                interiorColorName
            },
            parentStore:store
        })
    }
    onScroll(){
        console.log(this.props.store.isTopShow)
    }
    render() {
        return (
            <View style={{ height: SCREEN_HEIGHT, flex: 1 }}>
                {this.props.store.tabList.length > 0 ? (<View style={[styles.carItemOne, { width: SCREEN_WIDTH, top: 0, position: 'absolute', zIndex: 100 }]}><Text style={{ fontSize: 14, color: '#999999' }}>{this.props.store.tabList[0].carSeriesName}</Text></View>) : null}
                <ScrollView style={{ backgroundColor: 'white', flex: 1 }} 
                    scrollEventThrottle={0}
                    automaticallyAdjustContentInsets={false}
                    onScroll = {this.onScroll.bind(this)}
                >   
                    <View>
                        {this.props.store.tabList.length > 0 ? (this.props.store.tabList.map((item, index) => {
                            return (
                                <View style={styles.demoDetail}>
                                    <View style={styles.carItemOne}><Text style={{ fontSize: 14, color: '#999999' }}>{item.carSeriesName}</Text></View>
                                    {item.carModelNumbers.map((i, is) => {
                                        return (
                                            <View style={[styles.white, { marginBottom: is + 1 == item.carModelNumbers.length ? 0 : 12 }]}>
                                                <View style={styles.carItemTwo}>
                                                    <Text style={{ fontSize: 20, color: '#1A1A1A', fontWeight: 'bold' }}>{i.carModelName}</Text>
                                                    <View style={[styles.carItemTwoOne, { marginLeft: 0 }]}>
                                                        <Text style={styles.carItemTwoOneText}>在库可售 {i.librariesNumber}</Text>
                                                        <Text style={[styles.carItemTwoOneText, { paddingLeft: 12 }]}>在途可售 {i.routesNumber}</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    {i.carColorNumbers.map((it, its) => {
                                                        return (
                                                            it.isShow ? (<TouchableOpacity onPress={this.goDetail.bind(this, item.carSeriesCode, i.carModelCode, i.carModelName, it.exteriorColor, it.exteriorColorName, it.interiorColor, it.interiorColorName)}>
                                                                <View style={styles.item}>
                                                                    <View style={styles.items}>
                                                                        <View style={styles.detailItem}>
                                                                            {/* <View style={[styles.circle, { backgroundColor : it.isColorShow ? it.exteriorColor : "white" }]}></View> */}
                                                                            <View style={[styles.itemColors]}>
                                                                                <Text style={{  paddingRight: 12 }}>外观:{it.exteriorColorName}</Text>
                                                                                <Text>内饰:{it.interiorColorName}</Text>
                                                                            </View>
                                                                        </View>
                                                                        <View style={styles.carItemTwoOne}>
                                                                            <Text style={styles.carItemTwoOneText}>在库可售 {it.librariesNumber}</Text>
                                                                            <Text style={[styles.carItemTwoOneText, { paddingLeft: 12 }]}>在途可售 {it.routesNumber}</Text>
                                                                        </View>
                                                                        {it.isLock ? (it.countDown ? (
                                                                            <View style={styles.lockCar}>
                                                                                <Text style={{ color: "white", fontSize: 10 }}>锁定中</Text>
                                                                                {/* <Text>{this.state.minute}{this.state.second}{ setInterval(this.getTime.bind(this,it.lockTime),1000)}</Text> */}
                                                                                <Text style={{ marginLeft: 4, color: "white", fontSize: 10 }}>{new Date(it.countDownSeconds).getMinutes() < 10 ? '0' + new Date(it.countDownSeconds).getMinutes() : new Date(it.countDownSeconds).getMinutes()}分{new Date(it.countDownSeconds).getSeconds() < 10 ? '0' + new Date(it.countDownSeconds).getSeconds() : new Date(it.countDownSeconds).getSeconds()}秒</Text>
                                                                            </View>
                                                                        ) : null
                                                                        ) : null}
                                                                    </View>
                                                                    <Icon type={'angleRight'} size='md' />
                                                                </View>
                                                            </TouchableOpacity>) : null
                                                        )
                                                    })
                                                    }
                                                    {i.carColorNumbers.length > 3 ? (
                                                        <TouchableOpacity onPress={this.clickMore.bind(this, i.showText, index, is)}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
                                                                <Text style={{ color: '#666666', fontSize: 14, paddingRight: 4 }}>{i.showText}</Text>
                                                                <Icon type={i.showText == "展开更多" ? "angleDown" : 'angleUp'}></Icon>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </View>
                                            </View>

                                        )
                                    })}
                                </View>
                            )
                        })) : (<View style={{ flexDirection:'column',alignItems:'center',marginTop:80}}>
                            {this.props.store.whichPic == 1 ? (
                                <Image style={{ width: 144, height: 144 }} source={{uri:'https://assets.souche.com/assets/sccimg/chuanshanjia/loadingList.png'}}></Image>
                                ) : (
                                <View style={{ flexDirection:'column',alignItems:'center'}}>
                                    <Image style={{ width: 144, height: 144 }} source={{uri:'https://assets.souche.com/assets/sccimg/chuanshanjia/noList.png'}}></Image>
                                    <Text style={{ marginTop: 8 ,color:'#1B1C33',fontSize:16}}>{this.props.store.searchValue ? `暂未搜索到包含"${this.props.store.searchValue}"结果` : "暂未搜索到结果"}</Text>
                                </View>
                                )}
                        </View>)}
                    </View>
                </ScrollView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    one: {
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    hotSale: {
        flexDirection: 'row',
        paddingTop: 12,
        paddingHorizontal: 16,
        flexWrap: 'wrap',
        // marginHorizontal:16
    },
    hotSaleItem: {
        // width:(SCREEN_WIDTH - 32 - 32) / 4,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 10
    },
    hotSaleItemChoosed: {
        backgroundColor: '#FFEEE8',
        borderColor: '#FF571A',
    },
    hotSaleItemText: {
        fontSize: 12,
        color: '#1A1A1A'
    },
    hotSaleItemTextChoosed: {
        color: '#FF571A',
        fontSize: 12,
    },
    demoDetail: {
        backgroundColor: '#F2F3F5'
    },
    white: {
        backgroundColor: 'white'
    },
    carItemOne: {
        backgroundColor: '#F2F3F5',
        paddingTop: 16,
        paddingBottom: 8,
        paddingLeft: 16,
    },
    carItemTwo: {
        paddingTop: 21,
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        marginLeft: 16,
    },
    carItemTwoOne: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 22,
        // marginLeft: 25
    },
    carItemTwoOneText: {
        color: '#666666',
        fontSize: 12
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 16,
        paddingRight: 16,
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    items: {
        paddingTop: 16
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 50
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    itemColors: {
        flexDirection: 'row'
    },
    lockCar: {
        width: 95,
        flexDirection: 'row',
        backgroundColor: '#FF571A',
        marginBottom: 16,
        // marginLeft: 25,
        marginTop: -17,
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 6
    },
    colorSelect: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchHeaderRightSub: {
        flex: 1
    },
    searchHeaderRightSubText: {
        fontSize: 14
    },
    searchHeader: {
        width: 300,
        justifyContent:'center',
        alignItems:'center'
    },
})

export default InventoryKanBan;