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
    PixelRatio
} from 'react-native';
import SRNNative from '@souche-f2e/srn-native';
import { SRNPage, observer } from '@souche-f2e/srn-framework';
import _ from 'lodash';
import { CarModelSelect } from '../../shared/components/CarModel';
import { Color, Tabs, Form, Tag, Result, loading } from '@souche-ui/srn-ui';
import SearchPart from '../stockControl/components/Search';
import { theme } from '@souche-ui/srn-ui';

import Table from './components/Table';
import stockStore from '../../stores/stockStore';
import NavHelper from '@souche-f2e/srn-navigator';

const windoWidth = Dimensions.get('window').width;

@observer
@loading
class StockCarList extends SRNPage {
    static navigation = {
        title: {
            component: ({ emitter, sceneProps }) => {
                const routerProps = _.get(
                    sceneProps,
                    'scene.route.ComponentInstance.props',
                    {}
                );
                const { value = '' } = routerProps;
                return (
                    <View style={stylesExample.searchHeader}>
                        <SearchPart emitter={emitter} keyword={value} />
                    </View>
                );
            }
        },
        headerStyle: { borderBottomColor: '#FFFFFF' },
        left: {
            showArrow: true
        },
        right: {
            component: ({ emitter, sceneProps }) => {
                return (
                    <View style={stylesExample.searchHeaderRight}>
                        <View style={stylesExample.searchHeaderRightSub}>
                            <Text
                                style={stylesExample.searchHeaderRightSubText}>
                                筛选
                            </Text>
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
        this.page = 0;
        this.state = {
            value: '',
            stockList: {
                facInvCnt: '0', //全部
                facInvZkCnt: '0', //在库
                facInvZtCnt: '0', //在途
                isLockCnt: '0', //已锁车
                financialCarCnt: '0', //金融车
                overdueInventoryCnt: '0' //超期库龄车
            },
            carList: true,
            carDescList: [],
            dataSource: [],
            carTypeList: [],
            tabsData: 0,
            data: 0,
            refreshing: false,
            finished: false,
            totalNumber: 0
        };
        this.store = new stockStore();
        this.onPress = this.onPress.bind(this);
        this.carSeriesList = this.carSeriesList.bind(this);
        this.carTypeList = this.carTypeList.bind(this);
        this.stockList = this.stockList.bind(this);
        this.carDetailList = this.carDetailList.bind(this);

        this._handleAppend = this._handleAppend.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.changeTag = this.changeTag.bind(this);
    }
    componentWillMount() {
        let _th = this;
        this.stockList();
        this.setState({
            tabsData: this.props.tabs || 0
        });
        InteractionManager.runAfterInteractions(() => {
            this.emitter.on('selectCarModel', data => this.selectCarModel(data));
            this.emitter.on('initPage', data => this.store.initialPage());
        });
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.emitter.emit('store', { msg: this.store });
            if (this.props.tabs == 1) {
                this.store.changeCarSeries(this.props.value);
                this.carSeriesList();
            } else if (this.props.tabs == 2) {
                this.store.changeCarType(this.props.value);
                this.carTypeList();
            } else if (this.props.tabs === 0) {
                this.store.changeModel(this.props.value);
                this.carDetailList();
                this.store.changeTagCar(this.props.value);
                this.stockList();
            }
            if (!this.props.tagValue) {
                this.store.changeTags('facInvCnt');
                this.changeTag('facInvCnt');
            } else {
                this.store.changeTags(this.props.tagValue);
                this.changeTag(this.props.tagValue);
            }

            // if(!this.props.tabs&&this.props.tabs!=0){
            //     this.loading.show('加载中...');
            //     this.store.getCarDetailList(this.store.stockList).then(res=>{
            //         this.loading.hide();
            //         const nextState = {
            //             finished:false,
            //             carDescList:res.items,
            //             totalNumber:res.totalNumber
            //         };
            //         if (this.store.stockList.page>=res.totalPage) {
            //             this.setState({
            //                 finished:true
            //             })
            //         }
            //         this.store.changeDetailData(res.items)
            //         this.setState(nextState);

            //     })
            // }
        });
    }
    //筛选查询
    selectCarModel(dataArr) {
        this.store.changeStock('');
        this.store.changeModelCode('');
        this.store.changeCarTypCode('');
        this.store.changeTagCode('');

        // this.store.changeCarTypCode(dataArr[2].modelCode)
        // this.store.changeModelCode(dataArr[2].modelCode)
        if (this.state.data == '1') {
            this.store.changeCarSeries('');
            this.store.changeModelCode(dataArr[2].modelCode);
            SRNNative.Loading.show();
            this.store.getCarSeriesList(this.store.carSeriesData).then(res => {
                SRNNative.Loading.hide();
                this.setState({
                    totalNumber: res.totalNumber
                });
                if (this.store.stockList.page >= res.totalPage) {
                    this.setState({
                        finished: true
                    });
                }
                res.items.forEach(element => {
                    element.key = element.carModelId;
                });
                if (res.items.length > 0) {
                    this.setState({
                        carList: true
                    });
                } else {
                    this.setState({
                        carList: false
                    });
                }
                this.store.changeSeriesData(res.items);
                this.store.selectCarModel(dataArr);
                NavHelper.pop();
            });
        } else if (this.state.data == '2') {
            this.store.changeCarType('');
            this.store.changeCarTypCode(dataArr[2].modelCode);
            SRNNative.Loading.show();
            this.store.getCarTypeList(this.store.carTypeData).then(res => {
                SRNNative.Loading.hide();
                this.setState({
                    totalNumber: res.totalNumber
                });
                if (this.store.stockList.page >= res.totalPage) {
                    this.setState({
                        finished: true
                    });
                }
                res.items.forEach(element => {
                    element.key = element.carModelId;
                });
                this.store.changeTypeData(res.items);
                this.store.selectCarModel(dataArr);
                NavHelper.pop();
            });
        } else {
            this.store.changeModel('');
            this.store.changeStock(dataArr[2].modelCode);
            this.store.changeTagCode(dataArr[2].modelCode);
            this.stockList();
            SRNNative.Loading.show();
            this.store.getCarDetailList(this.store.stockList).then(res => {
                SRNNative.Loading.hide();
                console.log(res);
                this.setState({
                    totalNumber: res.totalNumber
                });
                if (this.store.stockList.page >= res.totalPage) {
                    this.setState({
                        finished: true
                    });
                }
                res.items.forEach((element, index) => {
                    element.key = res.carModelId;
                    element.carIndex = index + 1;
                    element.mianxiDate = (
                        (element.mianxiDate || '').split[0] || ''
                    ).replace(/-/g, '/');
                    element.expectedDeliveryDate = (
                        (element.expectedDeliveryDate || '').split[0] || ''
                    ).replace(/-/g, '/');
                });
                res.items.forEach(element => {
                    element.key = element.carModelId;
                });
                this.store.changeDetailData(res.items);
                this.store.selectCarModel(dataArr);
                NavHelper.pop();
            });
        }
        //this.store.changeCarType(dataArr[2].carModelName)
    }
    //下拉刷新
    _handleRefresh() {
        this.setState({ refreshing: true });
        // this.page = 0;
        this.store.initialPage();
        //console.log('下拉刷新',this.store.stockList)
        this.store.getCarDetailList(this.store.stockList).then(result => {
            console.log(result, '90909');
            let carDescList = [];
            carDescList = result.items;
            const nextState = {
                refreshing: false,
                finished: false
            };
            result.items.forEach((element, index) => {
                element.carIndex = index + 1;
                element.mianxiDate = (
                    (element.mianxiDate || '').split[0] || ''
                ).replace(/-/g, '/');
                element.expectedDeliveryDate = (
                    (element.expectedDeliveryDate || '').split[0] || ''
                ).replace(/-/g, '/');
            });
            this.setState({
                carDescList
            });
            this.setState(nextState);
            this.store.changeDetailData(result.items);
        });
    }
    //上拉加载
    _handleAppend() {
        console.log(this.state.finished, '1922');
        if (!this.state.finished) {
            this.store.increasePage();
            //console.log('上拉加载',this.store.stockList)
            this.store.getCarDetailList(this.store.stockList).then(result => {
                let { carDescList } = this.state;
                let finished = false;
                result.items.forEach((element, index) => {
                    element.key = result.carModelId;
                    element.carIndex = index + 1;
                    element.mianxiDate = (
                        (element.mianxiDate || '').split[0] || ''
                    ).replace(/-/g, '/');
                    element.expectedDeliveryDate = (
                        (element.expectedDeliveryDate || '').split[0] || ''
                    ).replace(/-/g, '/');
                });
                /** 结构，类似于遍历array然后push数据 */
                carDescList = [...carDescList, ...result.items];
                if (this.store.stockList.page == result.totalPage) {
                    finished = true;
                }
                this.setState({
                    finished,
                    carDescList
                });
                this.store.changeDetailData(carDescList);
            });
        }
    }

    //库存台账数据
    stockList() {
        let stockList = {};
        this.store.getStockList(this.store.carListNo).then(res => {
            carStockList = {
                facInvCnt: res.facInvCnt || 0, //全部
                facInvZkcnt: res.facInvZkCnt || 0, //在库
                facInvZtcnt: res.facInvZtCnt || 0, //在途
                isLockCnt: res.isLockCnt || 0, //已锁车
                financialCarCnt: res.financialCarCnt || 0, //金融车
                overdueInventoryCnt: res.overdueInventoryCnt || 0 //超期库龄车
            };
            this.store.changeCarStockList(res);
            this.setState({
                stockList: stockList
            });
        });
    }
    //明细接口
    carDetailList() {
        let list = [];
        this.store.changeDetailData(list);
        SRNNative.Loading.show();
        this.store.getCarDetailList(this.store.stockList).then(res => {
            console.log('231,执行了', res);
            SRNNative.Loading.hide();
            res.items.forEach((element, index) => {
                element.key = res.carModelId;
                element.carIndex = index + 1;
                element.mianxiDate = (
                    (element.mianxiDate || '').split[0] || ''
                ).replace(/-/g, '/');
                element.expectedDeliveryDate = (
                    (element.expectedDeliveryDate || '').split[0] || ''
                ).replace(/-/g, '/');
            });
            let finished = false;
            let carDescList = [];
            carDescList = res.items;
            if (this.store.stockList.page >= res.totalPage) {
                finished = true;
            }
            this.setState({
                carDescList,
                finished,
                totalNumber: res.totalNumber
            });
            this.store.changeDetailData(res.items);
        });
    }
    //切换tabs
    onPress(data) {
        this.setState({
            carList: true
        });
        if (data == 1) {
            this.store.changeCarSeries('');
            this.store.changeModelCode('');
            this.carSeriesList();
            this.store.tabsData = data;
            this.setState({
                data: data
            });
        } else if (data == 2) {
            this.store.changeCarType('');
            this.store.changeCarTypCode('');
            this.carTypeList();
            this.store.tabsData = data;
            this.setState({
                data: data
            });
        } else {
            this.store.changeModel('');
            this.store.changeStock('');
            this.store.initialPage();
            if (this.props.value) {
                this.store.changeTagCar(this.props.value);
                this.stockList();
                this.store.changeModel(this.props.value);
            }
            this.carDetailList();
            this.store.tabsData = data;
        }
    }
    //车系接口
    carSeriesList() {
        if (this.store.tabsData != this.state.tabsData) {
            this.store.tabsData = this.state.tabsData;
        }
        SRNNative.Loading.show();
        this.store.getCarSeriesList(this.store.carSeriesData).then(res => {
            SRNNative.Loading.hide();
            res.items.forEach((element, index) => {
                element.key = element.carSeriesId + index;
            });
            if (res.items.length > 0) {
                this.setState({
                    carList: true
                });
            } else {
                this.setState({
                    carList: false
                });
            }
            this.store.changeSeriesData(res.items);
        });
    }
    //车型接口
    carTypeList() {
        if (this.store.tabsData != this.state.tabsData) {
            this.store.tabsData = this.state.tabsData;
        }
        SRNNative.Loading.show();
        this.store.getCarTypeList(this.store.carTypeData).then(res => {
            SRNNative.Loading.hide();
            res.items.forEach(element => {
                element.key = element.carModelId;
            });
            this.store.changeTypeData(res.items);
        });
    }
    //切换tag标签查询
    changeTag(value) {
        if (value == 'facInvCnt') {
            this.store.wholeQuery();
            this.store.initialPage();
            this.carDetailList();
            this.setState({
                value
            });
        }
        if (value == 'facInvZkCnt') {
            this.store.stockQuery();
            this.store.initialPage();
            this.carDetailList();
            this.setState({
                value
            });
        }
        if (value == 'facInvZtCnt') {
            this.store.passQuery();
            this.store.initialPage();
            this.carDetailList();
            this.setState({
                value
            });
        }
        if (value == 'overdueInventoryCnt') {
            this.store.overQuery();
            this.store.initialPage();
            this.carDetailList();
            this.setState({
                value
            });
        }
        if (value == 'isLockCnt') {
            this.store.isLockQuery();
            this.store.initialPage();
            this.carDetailList();
            this.setState({
                value
            });
        }
        if (value == 'financialCarCnt') {
            this.store.financialQuery();
            this.store.initialPage();
            this.carDetailList();
            this.setState({
                value
            });
        }
        this.store.changeTags(value);
    }
    onActived(data) {
        console.log('onActived ', data);
    }
    _createListHeader(value) {
        return (
            <View>
                <View style={stylesExample.view}>
                    <View style={stylesExample.inlineItemWrapper}>
                        <Tag
                            selected={value == 'facInvCnt' ? true : false}
                            style={stylesExample.customTag1}
                            onSelect={this.changeTag.bind(this, 'facInvCnt')}
                            selectedStyle={{
                                backgroundColor: theme('color_opacity'),
                                borderColor: theme('color_primary')
                            }}
                            selectedTextStyle={{
                                color: theme('color_primary')
                            }}>
                            <Text style={{ fontSize: 12 }}>
                                全部
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color:
                                            value == 'facInvCnt'
                                                ? theme('color_primary')
                                                : Color.B3
                                    }}>
                                    ({this.store.carStockList.facInvCnt})
                                </Text>
                            </Text>
                        </Tag>
                    </View>
                    <View style={stylesExample.inlineItemWrapper}>
                        <Tag
                            selected={value == 'facInvZkCnt' ? true : false}
                            style={stylesExample.customTag1}
                            onSelect={this.changeTag.bind(this, 'facInvZkCnt')}
                            selectedStyle={{
                                backgroundColor: theme('color_opacity'),
                                borderColor: theme('color_primary')
                            }}
                            selectedTextStyle={{
                                color: theme('color_primary')
                            }}>
                            <Text style={{ fontSize: 12 }}>
                                在库
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color:
                                            value == 'facInvZkCnt'
                                                ? theme('color_primary')
                                                : Color.B3
                                    }}>
                                    ({this.store.carStockList.facInvZkcnt})
                                </Text>
                            </Text>
                        </Tag>
                    </View>
                    <View style={stylesExample.inlineItemWrapper}>
                        <Tag
                            selected={value == 'facInvZtCnt' ? true : false}
                            style={stylesExample.customTag1}
                            onSelect={this.changeTag.bind(this, 'facInvZtCnt')}
                            selectedStyle={{
                                backgroundColor: theme('color_opacity'),
                                borderColor: theme('color_primary')
                            }}
                            selectedTextStyle={{
                                color: theme('color_primary')
                            }}>
                            <Text style={{ fontSize: 12 }}>
                                在途
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color:
                                            value == 'facInvZtCnt'
                                                ? theme('color_primary')
                                                : Color.B3
                                    }}>
                                    ({this.store.carStockList.facInvZtcnt})
                                </Text>
                            </Text>
                        </Tag>
                    </View>
                    <View style={stylesExample.inlineItemWrapper}>
                        <Tag
                            selected={value == 'isLockCnt' ? true : false}
                            style={stylesExample.customTag1}
                            onSelect={this.changeTag.bind(this, 'isLockCnt')}
                            selectedStyle={{
                                backgroundColor: theme('color_opacity'),
                                borderColor: theme('color_primary')
                            }}
                            selectedTextStyle={{
                                color: theme('color_primary')
                            }}>
                            <Text style={{ fontSize: 12 }}>
                                已锁车
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color:
                                            value == 'isLockCnt'
                                                ? theme('color_primary')
                                                : Color.B3
                                    }}>
                                    ({this.store.carStockList.isLockCnt})
                                </Text>
                            </Text>
                        </Tag>
                    </View>
                    <View style={stylesExample.inlineItemWrapper}>
                        <Tag
                            selected={
                                value == 'overdueInventoryCnt' ? true : false
                            }
                            style={stylesExample.customTag1}
                            onSelect={this.changeTag.bind(
                                this,
                                'overdueInventoryCnt'
                            )}
                            selectedStyle={{
                                backgroundColor: theme('color_opacity'),
                                borderColor: theme('color_primary')
                            }}
                            selectedTextStyle={{
                                color: theme('color_primary')
                            }}>
                            <Text style={{ fontSize: 12 }}>
                                超期库存
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color:
                                            value == 'overdueInventoryCnt'
                                                ? theme('color_primary')
                                                : Color.B3
                                    }}>
                                    (
                                    {
                                        this.store.carStockList
                                            .overdueInventoryCnt
                                    }
                                    )
                                </Text>
                            </Text>
                        </Tag>
                    </View>
                    <View style={stylesExample.inlineItemWrapper}>
                        <Tag
                            selected={value == 'financialCarCnt' ? true : false}
                            style={stylesExample.customTag1}
                            onSelect={this.changeTag.bind(
                                this,
                                'financialCarCnt'
                            )}
                            selectedStyle={{
                                backgroundColor: theme('color_opacity'),
                                borderColor: theme('color_primary')
                            }}
                            selectedTextStyle={{
                                color: theme('color_primary')
                            }}>
                            <Text style={{ fontSize: 12 }}>
                                金融车
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color:
                                            value == 'financialCarCnt'
                                                ? theme('color_primary')
                                                : Color.B3
                                    }}>
                                    ({this.store.carStockList.financialCarCnt})
                                </Text>
                            </Text>
                        </Tag>
                    </View>
                </View>
                <View style={{ backgroundColor: Color.G4 }}>
                    <Text
                        style={{
                            display: this.state.totalNumber ? 'flex' : 'none',
                            color: '#999999',
                            fontSize: 14,
                            height: 38,
                            lineHeight: 38,
                            marginLeft: 16
                        }}>
                        共{this.state.totalNumber}台车
                    </Text>
                    <View
                        style={{
                            display: this.state.totalNumber ? 'none' : 'flex',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Image
                            style={{ width: 142, height: 142 }}
                            source={{
                                uri:
                                    'https://assets.souche.com/assets/sccimg/chuanshanjia/empty-car.png'
                            }}
                        />
                        <Text>暂无库存</Text>
                    </View>
                </View>
            </View>
        );
    }
    render() {
        const { carDescList } = this.state;
        const column = [
            {
                key: 'carSeriesName',
                title: '车系',
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facInvZkCnt',
                title: '在库',
                width: 74,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facInvZtCnt',
                title: '在途',
                width: 74,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'isLockCnt',
                title: '已锁车',
                width: 74,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'overdueInventoryCnt',
                title: '超期库存',
                width: 100,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'financialCarCnt',
                title: '金融车',
                width: 100,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'averageAge',
                title: '平均库龄',
                width: 100,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facSykcXs',
                title: '上月库存系数',
                width: 120,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facSyzzBfl',
                title: '上月周转率',
                width: 120,
                tabHeight: 120 / PixelRatio.get()
            }
        ];

        const carColumn = [
            {
                key: 'carModelName',
                title: '车型',
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facInvZkCnt',
                title: '在库',
                width: 74,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facInvZtCnt',
                title: '在途',
                width: 74,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'isLockCnt',
                title: '已锁车',
                width: 74,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'overdueInventoryCnt',
                title: '超期库存',
                width: 100,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'financialCarCnt',
                title: '金融车',
                width: 100,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'averageAge',
                title: '平均库龄',
                width: 100,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facSykcXs',
                title: '上月库存系数',
                width: 120,
                tabHeight: 120 / PixelRatio.get()
            },
            {
                key: 'facSyzzBfl',
                title: '上月周转率',
                width: 120,
                tabHeight: 120 / PixelRatio.get()
            }
        ];
        const tabViewData = [
            {
                name: '库存车',
                view: (
                    <View>
                        <FlatList
                            data={this.store.carDescList}
                            renderItem={({ item }) => (
                                <View>
                                    {this.store.carDescList.length > 0 ? (
                                        <View style={stylesExample.detail}>
                                            <View
                                                style={{
                                                    borderBottomColor:
                                                        '#D7D7DB',
                                                    borderBottomWidth: 1,
                                                    paddingBottom: 16,
                                                    marginBottom:
                                                        item.carIndex ===
                                                        this.store.carDescList
                                                            .length
                                                            ? 50
                                                            : 0
                                                }}>
                                                <Text
                                                    style={
                                                        stylesExample.carTitle
                                                    }>
                                                    {item.carModelName}
                                                </Text>
                                                <Text
                                                    style={
                                                        stylesExample.carDec
                                                    }>
                                                    <Text
                                                        style={{
                                                            marginHorizontal: 8
                                                        }}>
                                                        外观
                                                        {item.exteriorColor ||
                                                            '无'}{' '}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#dcdcdc'
                                                        }}>
                                                        {' '}
                                                        |{' '}
                                                    </Text>
                                                    <Text>
                                                        {' '}
                                                        内饰
                                                        {item.interiorColor ||
                                                            '无'}{' '}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#dcdcdc'
                                                        }}>
                                                        {' '}
                                                        |{' '}
                                                    </Text>
                                                    <Text>
                                                        {' '}
                                                        {item.carMassLossStatusName ||
                                                            '-'}
                                                    </Text>
                                                </Text>
                                                <Text
                                                    style={
                                                        stylesExample.carDec
                                                    }>
                                                    VIN:{item.vin}
                                                </Text>
                                                <Text
                                                    style={
                                                        stylesExample.carDec
                                                    }>
                                                    存放位置:
                                                    {item.storageLocation}
                                                </Text>
                                                <Text
                                                    style={
                                                        stylesExample.carDec
                                                    }>
                                                    免息截止日期:
                                                    {item.mianxiDate || '-'}
                                                </Text>
                                                <Text
                                                    style={
                                                        stylesExample.carDec
                                                    }>
                                                    预计交车日期:
                                                    {item.expectedDeliveryDate ||
                                                        '-'}
                                                </Text>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        marginTop:
                                                            32 /
                                                            PixelRatio.get(),
                                                        alignItems: 'center'
                                                    }}>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row'
                                                        }}>
                                                        <View
                                                            style={{
                                                                display: item.isLock
                                                                    ? 'flex'
                                                                    : 'none',
                                                                marginRight: 4,
                                                                borderRadius: 2
                                                            }}>
                                                            <Tag
                                                                autoWidth={
                                                                    false
                                                                }
                                                                style={
                                                                    stylesExample.tag
                                                                }
                                                                textStyle={{
                                                                    color: theme(
                                                                        'color_primary'
                                                                    ),
                                                                    fontSize: 10,
                                                                    fontWeight:
                                                                        'bold',
                                                                    paddingHorizontal: 8
                                                                }}>
                                                                {item.isLock}
                                                            </Tag>
                                                        </View>
                                                        <View
                                                            style={{
                                                                display: item.financialCar
                                                                    ? 'flex'
                                                                    : 'none',
                                                                borderRadius: 10
                                                            }}>
                                                            <Tag
                                                                autoWidth={
                                                                    false
                                                                }
                                                                style={
                                                                    stylesExample.tag
                                                                }
                                                                textStyle={{
                                                                    color: theme(
                                                                        'color_primary'
                                                                    ),
                                                                    fontSize: 10,
                                                                    fontWeight:
                                                                        'bold',
                                                                    paddingHorizontal: 8
                                                                }}>
                                                                {
                                                                    item.financialCar
                                                                }
                                                            </Tag>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        {item.overdueInventory !==
                                                        '超期' ? (
                                                            <Text
                                                                style={
                                                                    stylesExample.carStock
                                                                }>
                                                                库龄
                                                                {
                                                                    item.libraryAge
                                                                }
                                                                天
                                                            </Text>
                                                        ) : (
                                                            <Text
                                                                style={
                                                                    stylesExample.overdueCarStock
                                                                }>
                                                                库龄
                                                                {
                                                                    item.libraryAge
                                                                }
                                                                天，已超期
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                        <Image
                                            style={{
                                                width: 142,
                                                height: 142,
                                                marginTop:
                                                    120 / PixelRatio.get()
                                            }}
                                            source={{
                                                uri:
                                                    'https://assets.souche.com/assets/sccimg/chuanshanjia/empty-car.png'
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                            //头部布局
                            ListHeaderComponent={this._createListHeader.bind(
                                this,
                                this.state.value
                            )}
                            //加载更多
                            onEndReached={() => this._handleAppend()}
                            onEndReachedThreshold={0.7}
                            //下拉刷新
                            onRefresh={() => this._handleRefresh()}
                            refreshing={this.state.refreshing}
                        />
                    </View>
                )
            },
            {
                name: '车系',
                view: (
                    <View>
                        <View style={{ backgroundColor: Color.G4 }}>
                            <Text
                                style={{
                                    color: '#999999',
                                    fontSize: 14,
                                    height: 38,
                                    lineHeight: 38,
                                    marginLeft: 32 / PixelRatio.get(),
                                    display:
                                        this.store.dataSource.length > 0
                                            ? 'flex'
                                            : 'none'
                                }}>
                                共{this.store.dataSource.length}个车系
                            </Text>
                        </View>
                        {this.store.dataSource.length > 0 ? (
                            <ScrollView>
                                <Table
                                    column={column}
                                    dataSource={this.store.dataSource}
                                    tableWidth={760}
                                />
                            </ScrollView>
                        ) : (
                            <View>
                                <View
                                    style={{ height: 120 / PixelRatio.get() }}
                                />
                                <Result
                                    img={
                                        'https://assets.souche.com/assets/sccimg/chuanshanjia/empty-car.png'
                                    }
                                    title={'暂无库存'}
                                />
                            </View>
                        )}
                    </View>
                )
            },
            {
                name: '车型',
                view: (
                    <View>
                        <View style={{ backgroundColor: Color.G4 }}>
                            <Text
                                style={{
                                    color: '#999999',
                                    fontSize: 14,
                                    height: 38,
                                    lineHeight: 38,
                                    marginLeft: 32 / PixelRatio.get(),
                                    display:
                                        this.store.carTypeList.length > 0
                                            ? 'flex'
                                            : 'none'
                                }}>
                                共{this.store.carTypeList.length}个车型
                            </Text>
                        </View>
                        {this.store.carTypeList.length > 0 ? (
                            <ScrollView>
                                <Table
                                    column={carColumn}
                                    dataSource={this.store.carTypeList}
                                    tableWidth={760}
                                />
                            </ScrollView>
                        ) : (
                            <View>
                                <View
                                    style={{ height: 120 / PixelRatio.get() }}
                                />
                                <Result
                                    img={
                                        'https://assets.souche.com/assets/sccimg/chuanshanjia/empty-car.png'
                                    }
                                    title={'暂无库存'}
                                />
                            </View>
                        )}
                    </View>
                )
            }
        ];
        return (
            <View style={stylesExample.container}>
                <Tabs
                    tabsView={tabViewData}
                    onPress={this.onPress}
                    defaultIndex={this.state.tabsData}
                    scrollable
                    scrollableTabs
                    afterScrollActived={this.onPress}
                />
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
        paddingBottom: 40 / PixelRatio.get()
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
    }
});
export default StockCarList;
