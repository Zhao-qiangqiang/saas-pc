import React from 'react';

import { UIManager, Platform, findNodeHandle, SectionList, Easing, Animated, StyleSheet, View, Text, ScrollView, PixelRatio, TouchableOpacity, InteractionManager, Image, FlatList, RefreshControl, Dimensions } from 'react-native';
import {
    SRNPage,
    observer,
    LifeCircle,
    SRNConfig
} from '@souche-f2e/srn-framework';
import { Icon, } from '@souche-ui/srn-ui';

import _ from 'lodash';
import NavHelper from '@souche-f2e/srn-navigator';
import { KanBanSkeleton,TagSkeleton } from '../../components/skeleton'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@observer
class InventoryKanBan extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hotSaleChoosed: null,
            refreshing: false, // 是否下拉
            moveY: [], // 滑动距离
            hotHSaleHeight: 0, // 动态获取热门车系高度
            currentIndex: 0, // 点击某个车型的查看更多
            carSeierName: '',  // 吸顶的车系
            onTopHeight: 0, // 吸顶的view 高度
            colorTest: '/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/',
            isTopShow:false,
        }

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            // 热门车系接口
            this.props.store.getHotelCarTypes()

            //刷新列表
            this.props.store._onRefresh()

        })
    }


    // 热门车系切换,如果选中了，再次点击取消选中
    hotSalePress(index, value) {
        const { hotSaleValue } = this.props.store
        if (value == hotSaleValue) {
            value = ''
            index = null
        }
        this.setState({
            hotSaleChoosed: index
        })
        this.props.store.hotSaleTog(value)
    }
    // 获取热门车系的View高度
    onLayout(event) {
        this.setState({
            hotHSaleHeight: event.nativeEvent.layout.height
        })
        console.log(event.nativeEvent.layout.height, "热门销售高度")
    }

    // 通过子视图的onLayout属性获取离顶部的距离,滚动距离 与之比较 拿到index 进行列表判断
    onLayouts(event) {
        const { moveY } = this.props.store
        for (var i = 0; i < moveY.length; i++) {
            if (event.nativeEvent.target == moveY[i].target) {
                moveY[i].y = event.nativeEvent.layout.y
            }
        }
        let obj = {
            target: event.nativeEvent.target,
            y: event.nativeEvent.layout.y
        }
        this.props.store.moveYAction(obj)

    }

    onContentSizeChange(contentWidth, contentHeight) {
        console.log(contentWidth)
        console.log(contentHeight)
    }

    // 动态获取吸顶view的高度
    on(event) {
        if (this.props.store.isTopShow) {
            this.setState({
                onTopHeight: event.nativeEvent.layout.height
            })
        } else {
            this.setState({
                onTopHeight: 0
            })
        }
    }
    //  吸顶
    onScroll(event) {
        // console.log(event.nativeEvent.contentOffset.y)
        // if(event.nativeEvent.contentOffset.y <= 0){
        //     console.log("到这")
        //     this.add()
        //     // this.props.store.changeTopSow(false)
        // }

        if (this.props.store.tabListCopy.length <= 0) {
            this.setState({
                isTopShow:false
            })
            this.props.store.changeTopSow(false)

        } else {
                const { moveY } = this.props.store
                let y = event.nativeEvent.contentOffset.y
                console.log(y)
                if (y - this.state.hotHSaleHeight > 0) {
                    this.setState({
                        isTopShow:true
                    })
                    this.props.store.changeTopSow(true)
                } else {
                    this.setState({
                        isTopShow:false
                    })
                    this.props.store.changeTopSow(false)
                }
                let index = null
                if (this.props.store.tabBarList.length > 0) {
                    index = moveY.findIndex((item, index) => {
                        if (index == moveY.length - 1) {
                            return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y
                        } else {
                            return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y && event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight < moveY[index + 1].y
                        }
                    })
                } else {
                    index = moveY.findIndex((item, index) => {
                        if (index == moveY.length - 1) {
                            return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y
                        } else {
                            return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y && event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight < moveY[index + 1].y
                        }
                    })
                }
                if (index == -1) {
                    this.setState({
                        carSeierName: this.props.store.tabListCopy.length > 0 ? this.props.store.tabListCopy[this.props.store.tabListCopy.length - 1].carSeriesName : ''
                    })
                } else {
                    this.setState({
                        carSeierName: this.props.store.tabListCopy[index].carSeriesName
                    })
                }
        }
    }

    // 双手拖动离开视图
    onScrollEndDrag(event) {
        if (this.props.store.tabListCopy.length <= 0) {
            this.props.store.changeTopSow(false)
        } else {
            const { moveY } = this.props.store
            let y = event.nativeEvent.contentOffset.y
            if (y - this.state.hotHSaleHeight > 0) {
                this.props.store.changeTopSow(true)
            } else {
                this.props.store.changeTopSow(false)
            }
            let index = null
            if (this.props.store.tabBarList.length > 0) {
                index = moveY.findIndex((item, index) => {
                    if (index == moveY.length - 1) {
                        return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y
                    } else {
                        return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y && event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight < moveY[index + 1].y
                    }
                })
            } else {
                index = moveY.findIndex((item, index) => {
                    if (index == moveY.length - 1) {
                        return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y
                    } else {
                        return event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight >= item.y && event.nativeEvent.contentOffset.y - this.state.hotHSaleHeight < moveY[index + 1].y
                    }
                })
            }
            if (index == -1) {
                this.setState({
                    carSeierName: this.props.store.tabListCopy.length > 0 ? this.props.store.tabListCopy[this.props.store.tabListCopy.length - 1].carSeriesName : ''
                })
            } else {
                this.setState({
                    carSeierName: this.props.store.tabListCopy[index].carSeriesName
                })
            }
        }
    }

    // 展开更多 收起
    clickMore(value, index1, index2) {
        const { moveY } = this.props.store
        this.setState({
            currentIndex: index1,
        })
        if (index1 == 0) {
            this.props.store.moveYNull()
            // this.setState({
            //     moveY: []
            // })
        } else {
            const arr = moveY.slice(0, index1)
            this.props.store.moveYChange(arr)
            // this.setState({
            //     moveY: arr
            // })
        }

        if (value == "展开更多") {
            this.props.store.changeTabListAllCopy(index1, index2)

        } else {
            this.props.store.changeTabListNoneCopy(index1, index2)
        }

    }

    //  下拉刷新
    _onRefresh() {
        this.props.store._onRefresh()
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
            parentStore: store
        })
    }
    render() {
        const { store } = this.props
        return (
            <View style={{ height: SCREEN_HEIGHT, flex: 1 }}>
                {Platform.OS == 'ios' ? this.props.store.isTopShow ? (<View onLayout={this.on.bind(this)} style={[styles.carItemOne, { width: SCREEN_WIDTH, top: 0, position: 'absolute', zIndex: 100 }]}><Text style={{ fontSize: 14, color: '#1B1C33' }}>{this.state.carSeierName}</Text></View>) : null : <View onLayout={this.on.bind(this)} style={[styles.carItemOne, { width: SCREEN_WIDTH, top: 0, position: 'absolute', zIndex: 100,display:this.props.store.isTopShow ? 'flex' : 'none' }]}><Text style={{ fontSize: 14, color: '#1B1C33' }}>{this.state.carSeierName}</Text></View> }
                {/* {this.state.isTopShow ? (<View onLayout={this.on.bind(this)} style={[styles.carItemOne, { width: SCREEN_WIDTH, top: 0, position: 'absolute', zIndex: 100 }]}><Text style={{ fontSize: 14, color: '#999999' }}>{this.state.carSeierName}</Text></View>) : null} */}
                {/* <View onLayout={this.on.bind(this)} style={[styles.carItemOne, { width: SCREEN_WIDTH, top: 0, position: 'absolute', zIndex: 100,display:this.state.isTopShow ? 'flex' : 'none' }]}><Text style={{ fontSize: 14, color: '#999999' }}>{this.state.carSeierName}</Text></View> */}
                <ScrollView style={{ backgroundColor: 'white', flex: 1 }} refreshControl={
                    <RefreshControl
                        refreshing={this.props.store.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />}
                    onScroll={this.onScroll.bind(this)}
                    scrollEventThrottle={0}
                    automaticallyAdjustContentInsets={false}
                    onScrollEndDrag={this.onScroll.bind(this)}
                >
                    { store.isGetHotelCarTypes_API ?
                    <View>
                        {this.props.store.tabBarList.length > 0 ? (
                            <View onLayout={this.onLayout.bind(this)}>
                                <Text style={{ color: '#5E5E66', fontSize: 12, paddingTop: 16, marginLeft: 16 }}>热门车系</Text>
                                <View style={styles.hotSale}>
                                    {this.props.store.tabBarList.map((item, index) => {
                                        return (
                                            <TouchableOpacity onPress={this.hotSalePress.bind(this, index, item.carSeriesCode)}>
                                                <View key={index} style={[styles.hotSaleItem, this.state.hotSaleChoosed == index ? styles.hotSaleItemChoosed : '']}>
                                                    <Text style={[styles.hotSaleItemText, this.state.hotSaleChoosed == index ? styles.hotSaleItemTextChoosed : '']}>{item.carSeriesName}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        ) : null}
                    </View>: 
                    <View>
                        <Text style={{ color: '#5E5E66', fontSize: 12, paddingTop: 16, marginLeft: 16 }}>热门车系</Text>
                        <TagSkeleton />
                    </View> 
                    }
                    { store.isTabListCopy ? 
                         <View>
                         {this.props.store.tabListCopy.length > 0 ? (this.props.store.tabListCopy.map((item, index) => {
                             return (
                                 <View style={styles.demoDetail} onLayout={this.onLayouts.bind(this)}>
                                     <View style={styles.carItemOne}><Text style={{ fontSize: 14, color: '#1B1C33' }}>{item.carSeriesName}</Text></View>
                                     {item.carModelNumbers.map((i, is) => {
                                         return (
                                             <View style={[styles.white, { marginBottom: is + 1 == item.carModelNumbers.length ? 0 : 12 }]}>
                                                 <View style={styles.carItemTwo}>
                                                     <Text style={{ fontSize: 20, color: '#1A1A1A', fontWeight: 'bold' }}>{i.carModelName}</Text>
                                                     <View style={[styles.carItemPrice, { marginLeft: 0 }]}>
                                                         <Text style={styles.carItemTwoOneText}>{i.salesGuidancePriceWan ? `销售指导价 ${i.salesGuidancePriceWan}万` : `销售指导价 -`}</Text>
                                                     </View>
                                                     <View style={[styles.carItemTwoOne, { marginLeft: 0 }]}>
                                                         <Text style={styles.carItemTwoOneText}>在库可售 {i.librariesNumber}</Text>
                                                         <Text style={[styles.carItemTwoOneText, { paddingLeft: 12 }]}>在途可售 {i.routesNumber}</Text>
                                                     </View>
                                                 </View>
                                                 <View>
                                                     {i.carColorNumbers.map((it, its) => {
                                                         return (
                                                             it.isShow ? (<TouchableOpacity onPress={this.goDetail.bind(this, item.carSeriesCode, i.carModelCode, i.carModelName, it.exteriorColor, it.exteriorColorName, it.interiorColor, it.interiorColorName)}>
                                                                 <View style={[styles.item, its === i.carColorNumbers.length - 1 ? i.carColorNumbers.length > 3 ? styles.itemCopy : '' : styles.itemCopy]}>
                                                                     <View style={styles.items}>
                                                                         <View style={styles.detailItem}>
                                                                             {/* <View style={[styles.circle, { backgroundColor : it.isColorShow ? it.exteriorColor : "white" }]}></View> */}
                                                                             <View style={[styles.itemColors]}>
                                                                                 <Text style={{ paddingRight: 12 }}>外观:{it.exteriorColorName}</Text>
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
                         })) : (
                                 <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
                                     <Image style={{ width: 144, height: 144 }} source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/loadingList.png' }}></Image>
                                     <Text style={styles.noListStyle}>暂无库存</Text>
                                 </View>
                                 )}
                     </View> :

                    <View>
                        <KanBanSkeleton />
                    </View>

                    }
                   
                </ScrollView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    noListStyle: {
        fontSize: 16,
        color: '#1B1C33',
    },
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
    carItemPrice:{
        flexDirection: 'row',
        marginTop: 12,
        // marginBottom: 22,
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
    },
    itemCopy: {
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
        paddingHorizontal: 6,
        borderRadius: 2
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
        width: 300
    },
})

export default InventoryKanBan;