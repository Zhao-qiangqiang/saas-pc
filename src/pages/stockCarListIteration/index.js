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
import { SRNPage, observer, LifeCircle} from '@souche-f2e/srn-framework';
import _ from 'lodash';
import { CarModelSelect } from '../../shared/components/CarModel';
import { Color, Tabs, Form, Tag, Result, loading, Popover,  Icon, theme,FontSize } from '@souche-ui/srn-ui';
import SearchPart from './component/Search';

import stockStore from '../../stores/stockStore';
import NavHelper from '@souche-f2e/srn-navigator';

const windoWidth = Dimensions.get('window').width;

@observer
@loading
@LifeCircle
class stockCarListIteration extends SRNPage {
    static navigation = {
        title: {
            component: ({ emitter, sceneProps }) => {
                const routerProps = _.get(
                    sceneProps,
                    'scene.route.ComponentInstance.props',
                    {}
                );
                const { value  } = routerProps;
                return (
                    <View style={stylesExample.searchHeader}>
                        <SearchPart emitter={emitter} keyword={value} />
                    </View>
                );
            }
        },
        headerStyle: { borderBottomColor: '#FFFFFF' },
        left: {
            showArrow: true,
        },
        right: {
            component: ({ emitter, sceneProps }) => {
                return (
                    <View style={stylesExample.searchHeaderRight}>
                        <View style={stylesExample.searchHeaderRightSub}>
                            <Text style={stylesExample.searchHeaderRightSubText}>筛选</Text>
                        </View>
                    </View>
                );
            },
            onPress: (emitter, sceneProps) => {
                emitter.emit('initPage');
                NavHelper.push(CarModelSelect, {
                    level: 3,
                    emitter,
                    title: '车系/车型'
                });
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            data: 0,
        };
        this.store = new stockStore();
        this.onPress = this.onPress.bind(this);

        this._handleAppend = this._handleAppend.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.firstLoading = this.firstLoading.bind(this);
        this.nextLoading = this.nextLoading.bind(this);
        this.changeTag = this.changeTag.bind(this);//当前页点击tag显示
    }
    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            //车型筛选回调
            
            this.emitter.on('selectCarModel', data => this.selectCarModel(data));
            this.emitter.on('initPage', data => this.store.initialPage());
        });
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.emitter.emit('store', { store: this.store });
              
               //搜索标签添加模糊查询列表，及库存台账
               const { inventoryData, carListNo } = this.store

               //从库存总览带过来车系，车型
               const { carInfo } = this.props
                this.store.inventoryDataChange({
                    ...inventoryData,
                    globalSearch:this.props.value || '',
                    ...carInfo
                })
               this.store.carListNoChange({
                   ...carListNo,
                   globalSearch:this.props.value || '',
                   ...carInfo
                })
                this.store.carInfoChange(carInfo)
               this.store.queryInventoryTab(this.store.carListNo)

            //判断是否是从搜索过来的，还是从点击过来的 默认是全部 渲染数据
            if (!this.props.tagValue) {
                this.store.changeTags('facInvCnt');
                this.changeTag('facInvCnt');
            } else {
                this.store.changeTags(this.props.tagValue);
                this.changeTag(this.props.tagValue);
            }
        });
    }

    //车型3级筛选查询 
    selectCarModel(dataArr) {
        /** 执行：
         * 库存台账查询
         * 列表查询
         * 拿到查询到的车型赋值给 carListNo 查询台账
         * 拿到查询到的车型赋值给 inventoryData 查询列表
         * 关闭
         * 
         */
        const { inventoryData, carListNo } = this.store
        //允许进行加载数据
        this.store.changeIsLoading(true)

        //赋值列表查询条件
        this.store.inventoryDataChange({
            ...inventoryData,
            carSeriesFilter:'',
            modelCode:dataArr[dataArr.length - 1] ? dataArr[dataArr.length - 1].modelCode : ''
        })
        this.firstLoading()

        //赋值库存台账查询条件
        this.store.carListNoChange({
            ...carListNo,
            carSeriesFilter:'',
            modelCode:dataArr[dataArr.length - 1] ? dataArr[dataArr.length - 1].modelCode : ''
        })
        this.store.queryInventoryTab(this.store.carListNo)
        
        NavHelper.pop();
    }
    firstLoading(){
        const { pageInfo ,isPull,inventoryData} = this.store
        //首次加载
        if(isPull){
            pageInfo.page = 1
            this.store.queryInventoryListPull(inventoryData,pageInfo)
        }
    }
    nextLoading(){
        const { pageInfo ,isPush,inventoryData} = this.store
        if(isPush){
            pageInfo.page += 1
            this.store.queryInventoryListPush(inventoryData,pageInfo)
        }
    }
    //下拉刷新
    _handleRefresh() {
       this.firstLoading()
    }
    //上拉加载
    _handleAppend() {
       this.nextLoading()
    }

    //切换tag标签查询
    changeTag(value) {
        //触发请求
        /**
         * 根据value去查选中的是哪一个，然后把其他的清空，只调用当前的标签页
         * 清空字段
         * sortFiledDefault.value //默认值不能清掉
         * 保留首页跳转过来的tagValue 
         * 保留搜索值
         */
        this.store.changeIsLoading(true)

        const { inventoryTabArr,inventoryData,sortFiledDefault,carListNo ,carInfo}  = this.store
        let selectedTag = inventoryTabArr.find(item => item.value == value)
        const globalSearch = inventoryData.globalSearch
        //清空值
        for(let k in inventoryData){
            inventoryData[k] = ''
        }
        this.store.inventoryDataChange({
            ...inventoryData,
            globalSearch,
            sortFiled:sortFiledDefault.value,
            modelCode:carListNo.modelCode,
            carSeriesFilter:carListNo.carSeriesFilter,
           ...carInfo
            
        })

        if(selectedTag && selectedTag.reqName){
            this.store.inventoryDataChange({
                ...inventoryData,
                globalSearch,
                sortFiled:sortFiledDefault.value,
                modelCode:carListNo.modelCode,
                carSeriesFilter:carListNo.carSeriesFilter,
                [selectedTag.reqCode]:selectedTag.reqName,
                ...carInfo
            })
        }
        
        this.store.changeTags(value);
        this.firstLoading()
    }
     //触发选择库龄排序,查询列表
    onPress(value){
        this.store.onSortFiledDefaultChange(value)
        this.store.changeIsLoading(true)
        this.firstLoading()
    }

    render() {
        const { inventoryTabArr,inventorySource,pageInfo,isRefresh,sortFiledList,sortFiledDefault,tagValue } = this.store
        const getContent = (onPress) => {
            return (
                <Popover.Menu>
                    {
                        sortFiledList.map((item,idx) => {
                            return (
                                <Popover.Menu.Item  key={idx}
                                    selected={item.value == sortFiledDefault.value} 
                                    onPress={() => { onPress && onPress(item); }}>
                                    { item.label }
                                </Popover.Menu.Item>
                            )
                        })
                    }
                </Popover.Menu>
            );
        };
        return (
            <View style={stylesExample.container}>
                {/* 头部筛选 */}
                <View>
                    <View style={stylesExample.view}>
                    { inventoryTabArr.map(( item, idx ) => (
                        <View style={stylesExample.inlineItemWrapper} key={idx}>
                            <Tag
                                selected={tagValue == item.value ? true : false}
                                style={stylesExample.customTag1}
                                onSelect={this.changeTag.bind(this, item.value)}
                                selectedStyle={{ backgroundColor: theme('color_opacity'), borderColor: theme('color_primary') }}
                                selectedTextStyle={{ color: theme('color_primary') }}>
                                <Text style={{ fontSize: 12 }}>{item.label}
                                    <Text style={{ fontSize: 10, color: tagValue == item.value ? theme('color_primary') : Color.B3 }}>
                                        ({item.num})
                                    </Text>
                                </Text>
                            </Tag>
                        </View>
                    ))
                    }
                    </View>
                    { pageInfo.totalNumber > 0 ? 
                        <View style={{ backgroundColor: Color.G4 ,flexDirection:'row',justifyContent:'space-between',}}>
                            <Text style={stylesExample.totalCar}>
                                共{pageInfo.totalNumber}台车
                            </Text>
                            
                            <Popover
                                style={stylesExample.popTitle}
                                content={getContent(this.onPress)}
                                placement="bottomRight"
                                offset={{top: 0}}
                                theme={'light'}
                            >
                                <Text style={stylesExample.titleText}>{ sortFiledDefault.label }</Text>
                                <Icon type={Icon.caretDown} size="xxs" style={stylesExample.titleIcon} />
                            </Popover>
                        
                        </View>: null
                    }
                </View> 
                {/* 列表 */}
                { inventorySource.length > 0 ? 
                    <FlatList
                        data={inventorySource}
                        renderItem={({ item }) => (
                            <View>
                                {inventorySource.length > 0 ? (
                                    <View style={stylesExample.detail}>
                                    <View style={{
                                            borderBottomColor: '#D7D7DB',
                                            borderBottomWidth: 1,
                                            paddingBottom: 16,
                                            marginBottom: item.carIndex >= this.store.inventorySource.length? 50 : 0
                                        }}>
                                        <Text style={ stylesExample.carTitle }>{item.carModelName}</Text>
                                        <Text style={ stylesExample.carDec }>
                                            <Text style={ stylesExample.marginHorizontal8 }>外观{item.exteriorColor || '无'}{' '}</Text>
                                            <Text style={stylesExample.colorDcdcdc}>{' '}|{' '}</Text>
                                            <Text>{' '}内饰{item.interiorColor || '无'}{' '}</Text>
                                            <Text style={stylesExample.colorDcdcdc}>{' '}|{' '}</Text>
                                            <Text>{' '}{item.carMassLossStatusName ||'-'}</Text>
                                        </Text>
                                        <Text style={ stylesExample.carDec }>VIN:{item.vin}</Text>
                                        <Text style={ stylesExample.carDec }>存放位置:{item.storageLocation}</Text>
                                        <Text style={ stylesExample.carDec }>免息截止日期:{item.mianxiDate || '-'}</Text>
                                        <Text style={ stylesExample.carDec }>预计交车日期:{item.expectedDeliveryDate ||'-'}</Text>
                                        <View style={ stylesExample.tagStyle }>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                {/* 在库/在途 */}
                                                { item.invStatusName && tagValue != 'facInvZtCnt' && tagValue != 'facInvZkCnt' ? 
                                                <View style={{ display:'flex', marginRight: 4, borderRadius: 2 }}>
                                                        <Tag 
                                                            autoWidth={ false }
                                                            style={ stylesExample.tag } 
                                                            textStyle={ stylesExample.tagTextStyle }
                                                        >{item.invStatusName}</Tag>
                                                    </View> : null
                                                }
                                                {/* 超期*/}
                                                { item.overdueInventory && tagValue != 'overdueInventoryCnt' ?
                                                <View style={{ display:'flex', marginRight: 4, borderRadius: 2 }}>
                                                        <Tag 
                                                            autoWidth={ false }
                                                            style={ stylesExample.tag } 
                                                            textStyle={ stylesExample.tagTextStyle }
                                                        >{item.overdueInventory}</Tag>
                                                    </View> : null
                                                }
                                                {/* 订单锁定*/}
                                                { item.isLock && tagValue != 'isLockCnt' ?
                                                    <View style={{ display:'flex', marginRight: 4, borderRadius: 2 }}>
                                                        <Tag 
                                                            autoWidth={ false }
                                                            style={ stylesExample.tag } 
                                                            textStyle={ stylesExample.tagTextStyle }
                                                        >{item.isLock}</Tag>
                                                    </View> : null
                                                }
                                                {/* 金融车*/}
                                                { item.financialCar && tagValue != 'financialCarCnt' ?
                                                    <View style={{ display: 'flex', borderRadius: 10 }}>
                                                        <Tag 
                                                            autoWidth={ false } 
                                                            style={ stylesExample.tag }
                                                            textStyle={ stylesExample.tagTextStyle }
                                                        >{ item.financialCar }</Tag>
                                                    </View> : null
                                                }
                                            </View>
                                            <View>
                                                {item.overdueInventory !== '超期' ? (
                                                    <Text style={ stylesExample.carStock }> 库龄{item.libraryAge}天</Text>
                                                ) : (
                                                    <Text style={ stylesExample.overdueCarStock }>库龄{item.libraryAge}天，已超期</Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                ) : null
                                }
                            </View>
                        )}
                        //加载更多
                        onEndReached={() => this._handleAppend()}
                        onEndReachedThreshold={0.2}
                        //下拉刷新
                        onRefresh={() => this._handleRefresh()}
                        refreshing={isRefresh}
                    /> : 
                     <View style={stylesExample.imgStyle}>
                        <Image  style={{ 
                            width: 142,
                            height: 142,
                            marginTop: 120 / PixelRatio.get()
                            }}
                        source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/empty-car.png' }} />
                        <Text>暂无库存</Text>
                    </View>
                    }
            </View>
        );
    }
}

const stylesExample = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.G4
    },
    wrapper: {
        marginVertical: 10,
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    },
    tag: {
        height: 16,
        backgroundColor: theme('color_opacity')
    },
    view: {
        backgroundColor: Color.White1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        paddingBottom: 20 / PixelRatio.get()
    },
    customTag1: {
        height: 30,
        paddingHorizontal: 10,
        backgroundColor: '#F5F5F5',
        borderColor: '#F5F5F5'
    },
    inlineItemWrapper: {
        marginRight: 20 / PixelRatio.get(),
        marginBottom: 20 / PixelRatio.get()
    },
    tagList: {
        height: 30,
        marginLeft: 10
    },
    detail: {
        padding: 16,
        paddingBottom: 0,
        backgroundColor: Color.White1
    },
    noList:{
        flexDirection:'row',
        justifyContent:'center',
        paddingBottom: 0,
        backgroundColor: Color.White1,
        height:'100%'
    },
    imgStyle:{
        flexDirection:'column',
        // flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.White1,
        // backgroundColor: 'red',
        height:'100%'
    },
    carDec: {
        fontSize: 12,
        color: '#5E5E66',
        marginTop: 6
    },
    carTitle: {
        fontSize: 14,
        color: '#1B1C33',
        fontWeight: 'bold'
    },
    carStock: {
        fontSize: 14
    },
    overdueCarStock: {
        color: '#FF4040',
        fontSize: 14
    },
    searchHeader: {
        width: 300
    },
    searchContent: {
        width: 300
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
    buttonWrapper: {
        width: windoWidth * 0.9,
        padding: 10
    },
    grid: {
        marginVertical: 10,
        paddingHorizontal: 16
    },
    colorDcdcdc:{
        color:'#dcdcdc'
    },
    marginHorizontal8:{
        marginHorizontal:8
    },
    tagStyle:{
        flex: 1,
        flexDirection: 'row',
        marginTop:32 /PixelRatio.get(),alignItems: 'center'
    },
    tagTextStyle:{
        color: theme( 'color_primary' ),
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 8 
    },
    popTitle: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding:10
    },
    titleText: {
        color: '#1B1C33', 
        fontSize: 14, 
        marginRight: 4,
    },
    totalCar:{
        color: '#999999', 
        fontSize: 14, 
        height: 38, 
        lineHeight: 38 ,
        paddingLeft:16,
    },
    titleIcon:{
        tintColor: '#999999', 
    }
});
export default stockCarListIteration;
