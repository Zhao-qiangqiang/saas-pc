/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 10:54:15
 * @LastEditTime: 2019-09-02 20:15:14
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    RefreshControl,
    InteractionManager,
    Image,
    PixelRatio,
} from 'react-native';
import { SRNPage, observer } from '@souche-f2e/srn-framework';
import _ from 'lodash';
import { CarListSearch } from '../../shared/components/SearchPage';
import {
    Search, Filter, Radio, Tag,
} from '@souche-ui/srn-ui';
import { StylesExample, ColorAndTypeSelector, ListItem, formatFilterDataFn, formatFilterCarNoDataFn } from './Component'
import { TagSkeleton,ListItemSkeleton } from '../../components/skeleton'
import InventoryCarListStore from '../../stores/InventoryCarListStore';
import NavHelper from '@souche-f2e/srn-navigator';

@observer
class InventoryCarList extends SRNPage {
    static navigation = {
        title: {
            text: '加载中'
        },
        headerStyle: { borderBottomColor: '#FFFFFF' },
        left: {
            showArrow: true,
        },
        right: {}
    }
    constructor(props) {
        super(props);
        this.state = {
            filterDefaultValue: {
                sortFiled: { label: '库龄最长', value: '4' },
                extra: {
                    carTag: [{ label: '全部', value: 'all' }],
                    libraryAge: [{ label: '全部', value: 'all' }],
                    price: [{ label: '全部', value: 'all' }],
                    interestholiday: [{ label: '全部', value: 'all' }]
                }
            },
            isShowNavigation: true,//默认展示导航条
            scrollHeight:100,//滚动的距离差
            startOffsetY:0,//默认滚动开始的位置
        }
        this.handleChange = this.handleChange.bind(this)
        this.setNavigationFn = this.setNavigationFn.bind(this)
        this.onTagClick = this.onTagClick.bind(this)
        this.onSelectedCar = this.onSelectedCar.bind(this)
        this.changeTag = this.changeTag.bind(this)
        this.resetSelectFn = this.resetSelectFn.bind(this)
        this._onRefresh = this._onRefresh.bind(this)
        this._contentViewScroll = this._contentViewScroll.bind(this)
        this._onScroll = this._onScroll.bind(this)
        this._onScrollBeginDrag = this._onScrollBeginDrag.bind(this)

        /**
         * 从其他页面传参进入
         * @param {*} globalSearch 顶部模糊查询 
         * @param {*} tagValue 首页标签点击跳转过来
         * @param {*} carInfo 库存结构跳转过来
         */

        this.store = new InventoryCarListStore();

    }
    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            //modelCode是从新车行情跳转过来的
            const { globalSearch = '', carInfo = {}, tagValue = 'facInvCnt',modelCode = '' } = this.props
            // carInfo = {
            //     carSeriesFilter: "X03"
            //     carTypeCode: ""
            //     libraryAgeSeach: "库龄等级G"
            // }
            const { filterDefaultValue } = this.state
            const { inventoryData, carListNo, carTagList } = this.store
            this.store.globalSearchChange(globalSearch)
            this.store.inventoryDataChange({
                ...inventoryData,
                globalSearch,
                modelCode,
                ...carInfo
            })

            this.store.carListNoChange({
                ...carListNo,
                globalSearch,
                modelCode,
                ...carInfo
            })
            //根据传过来的tagValue 添加默认选中
            let tagObj = {
                invStatusName: '',//在库，在途
                isLock: '',//订单选定
                overdueInventory: '',//超期库存
                financialStatus: '',//现金车，融资车
            }
            if (tagValue) {
                //说明从props传过来的有标签
                //facInvCnt(全部) facInvZkCnt(在库) facInvZtCnt(在途) isLockCnt(订单锁定)
                //overdueInventoryCnt(超期库存) cashCarCnt(现金车) financialCarCnt(金融车/融资车)

                if (tagValue == 'facInvCnt') {
                    carTagList[0].isSelect = true
                }
                if (tagValue == 'facInvZkCnt') {
                    tagObj.invStatusName = '在库'
                    filterDefaultValue.extra.carTag = [{ label: '在库', value: '1' }]
                    carTagList[1].isSelect = true
                }
                if (tagValue == 'facInvZtCnt') {
                    tagObj.invStatusName = '在途'
                    filterDefaultValue.extra.carTag = [carTagList[2]]
                    carTagList[2].isSelect = true
                }
                if (tagValue == 'isLockCnt') {
                    tagObj.isLock = '1'
                    filterDefaultValue.extra.carTag = [carTagList[3]]
                    carTagList[3].isSelect = true
                }
                if (tagValue == 'overdueInventoryCnt') {
                    tagObj.overdueInventory = '1'
                    filterDefaultValue.extra.carTag = [carTagList[4]]
                    carTagList[4].isSelect = true
                }
                if (tagValue == 'cashCarCnt') {
                    tagObj.financialStatus = '现金车'
                    filterDefaultValue.extra.carTag = [carTagList[5]]
                    carTagList[5].isSelect = true
                }
                if (tagValue == 'financialCarCnt') {
                    tagObj.financialStatus = '融资车'
                    filterDefaultValue.extra.carTag = [carTagList[6]]
                    carTagList[6].isSelect = true
                }
            }
            this.store.inventoryDataChange({
                ...inventoryData,
                globalSearch,
                ...carInfo,
                modelCode,
                ...tagObj
            })
            this.setState({ filterDefaultValue })
            this.store.carTagListChange(carTagList)

            //动态添加导航条
            this.setNavigationFn(true)

        });
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.store.queryInventoryTab()
            this._onRefresh()
            //查询品牌车辆数量
            this.store.GetThrSeriesCatalogByOrg({type:1,code:''})
            //查询库龄标签 并且赋值 filterDefaultValue 库龄标签
            const { carInfo } = this.props
            const { filterDefaultValue } = this.state
            
            this.store.GetLibraryAgeLabel().then(res => {
                if(res && carInfo && carInfo.libraryAgeSeach){
                    let list = res.find(item => item.value == carInfo.libraryAgeSeach)
                    if(list){
                        filterDefaultValue.extra.libraryAge = [list]
                        this.setState({
                            filterDefaultValue
                        })
                    } 
                }
            })
            //查询资金来源
            this.store.GetFinancialSourceLabel()
            //查询免息截止日期
            this.store.GetExInterestBearingDateLabel()

            // this.showNavigation()
            // this.setNavigationFn(true)

            // this.hideNavigation()
            // this.setNavigationFn(false)

        });
    }
    //动态设置导航条
    setNavigationFn(flag) {
        if (flag) {
            this.setState({ isShowNavigation:true })
            this.setNavigation({
                title: {
                    component: ({ emitter, sceneProps }) => {
                        setTimeout(() => {
                            this.emitter.emit('store', { store: this.store, tagFlag: 'carList' });
                        }, 0)
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    NavHelper.push(CarListSearch, {
                                        emitter,
                                        keyWords: this.store.globalSearch
                                    });
                                }}>
                                <View style={StylesExample.searchHeaderInput}>
                                    <Search.Indicator placeholder={this.store.globalSearch || '搜索车系/车型'} />
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    }
                },
                left: {
                    showArrow: true,
                },
            });
        } else {
            this.setState({ isShowNavigation:false })
            this.setNavigation({
                title: {
                    text: '',
                },
                left: {
                    text: ''
                }
            });
        }
    }
    /**
     * 列表也数据选中
     */
    changeTag(val) {

        const { filterDefaultValue } = this.state
        const { carTagList } = this.store
        let selectedList = []
        let allIndex = carTagList.findIndex(item => item.value == 'all')

        carTagList.map(item => {
            //如果点击的是全部，把其他的取消掉
            if (val.value == 'all') {
                item.isSelect = false;
                item.value == val.value && (item.isSelect = true)
            } else {
                item.value == val.value && (item.isSelect = !item.isSelect);
                item.value == 'all' && (item.isSelect = false)
            }
            item.isSelect && selectedList.push(item);
        })

        if (selectedList.length == 0) {
            carTagList[allIndex].isSelect = true
            selectedList.push(carTagList[allIndex]);
        }

        this.store.carTagListChange(carTagList)
        //附筛选默认值
        filterDefaultValue.extra.carTag = selectedList
        this.setState({ filterDefaultValue })

        // 拿到选中的进行查询 ,默认赋值，进行查询
        let filterData = formatFilterDataFn(filterDefaultValue.extra)
        const { inventoryData } = this.store
        this.store.inventoryDataChange({
            ...inventoryData,
            ...filterData
        })
        this._onRefresh()


    }
    //筛选选中数据
    handleChange(value, key) {
        const { filterDefaultValue } = this.state
        filterDefaultValue[key] = value[key]
        this.setState({ filterDefaultValue })

        if (key == 'sortFiled') {
            const { inventoryData } = this.store
            //排序去查询接口 ,下拉刷新
            this.store.inventoryDataChange({ ...inventoryData, sortFiled: value[key].value })
            this._onRefresh()

        }
    }
    //重置选择
    resetSelectFn(tagList, carList) {
        const { filterDefaultValue } = this.state
        filterDefaultValue['extra'] = tagList
        this.setState({ filterDefaultValue })

        const { carTagList } = this.store
        // 拿到选中的值进行默认赋值 
        carTagList.map(item => {
            item.value == 'all' ? item.isSelect = true : item.isSelect = false
        })
        this.store.carTagListChange(carTagList)

        // 拿到选中的进行查询 ,默认赋值，进行查询
        let filterData = formatFilterDataFn(tagList)
        let filterCarNoData = formatFilterCarNoDataFn(tagList)

        const { inventoryData, carListNo } = this.store
        this.store.inventoryDataChange({
            ...inventoryData,
            ...filterData,
            carSeriesFilter: '',
            modelCode: ''
        })
        this.store.carListNoChange({
            ...carListNo,
            ...filterCarNoData,
            carSeriesFilter: '',
            modelCode: ''
        })

        this._onRefresh()
        this.store.queryInventoryTab()

    }
    //车型筛选数据回调
    onSelectedCar(carList) {
        let modelCode = Object
            .keys(carList || {})
            .map(key => carList[key].code)
            .join(',')
        const { inventoryData, carListNo } = this.store
        this.store.inventoryDataChange({
            ...inventoryData,
            carSeriesFilter: '',
            modelCode
        })

        this.store.carListNoChange({
            ...carListNo,
            carSeriesFilter: '',
            modelCode
        })
        //查询数据
        this._onRefresh()
        this.store.queryInventoryTab()
    }
    //下拉刷新
    _onRefresh() {
        this.store._refresh()
    }
    //上拉刷新
    _contentViewScroll(e) {
        // const { inventorySource } = this.store
        // let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        // let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        // let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        // if (offsetY > 0 && offsetY + oriageScrollHeight >= contentSizeHeight) {
        //     if( !this.store.isLastPage && !this.store.isSearching &&  inventorySource.length > 0){
        //         this.store.queryInventoryList()
        //     }
        // }
    }
    _onScrollBeginDrag(e){
        const offsetY = e.nativeEvent.contentOffset.y;
        this.setState({
            startOffsetY:offsetY
        })
    }
    _onScroll(e){
        const { inventorySource } = this.store
        const { startOffsetY,scrollHeight,isShowNavigation } = this.state
        let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        console.log(`滚动中${offsetY}`) 

        let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        //上拉刷新
        if (offsetY > 0 && offsetY + oriageScrollHeight + 20 >= contentSizeHeight) {
            console.log(`执行上拉加载`)
            if( !this.store.isLastPage && !this.store.isSearching &&  inventorySource.length > 0){
                this.store.queryInventoryList()
            }
        }

        const  offsetYAbs = Math.abs(offsetY)

        if(startOffsetY >= offsetY ){
          //下拉，展示导航条
         if((offsetYAbs > scrollHeight &&  !isShowNavigation) || offsetYAbs === 0){
            console.log(`展示导航条`)
            this.showNavigation()
            this.setNavigationFn(true)
         }
        }else{
            //上拉，隐藏导航条
            if(offsetYAbs > scrollHeight && isShowNavigation && inventorySource.length > 0 ){
                console.log(`隐藏导航条`)
                this.hideNavigation()
                this.setNavigationFn(false)
            }
        }
    }


    //筛选标签选择
    onTagClick(selected, key) {
        const { filterDefaultValue } = this.state
        filterDefaultValue[key] = selected
        this.setState({ filterDefaultValue })
        const { carTag } = selected
        //库存标签默认选中
        const { carTagList } = this.store
        // 拿到选中的值进行默认赋值 carTagListChange
        carTagList.map(item => item.isSelect = false)
        carTag.map(item => {
            let isSelectIndex = carTagList.findIndex(val => val.value == item.value)
            isSelectIndex > -1 && (carTagList[isSelectIndex].isSelect = true)
        })

        this.store.carTagListChange(carTagList)
        // 拿到选中的进行查询 ,默认赋值，进行查询
        let filterData = formatFilterDataFn(selected)
        let filterCarNoData = formatFilterCarNoDataFn(selected)

        const { inventoryData, carListNo } = this.store
        this.store.inventoryDataChange({
            ...inventoryData,
            ...filterData
        })
        this.store.carListNoChange({
            ...carListNo,
            ...filterCarNoData,
        })
        
        //查询数据
        this._onRefresh()
        this.store.queryInventoryTab()
    }

    render() {
        const { sortFiledList, carTagList, pageInfo, inventorySource, isLoading,isGetStockCar,isGetStockAccountDet } = this.store
        const { filterDefaultValue,isShowNavigation } = this.state
        let _th = this

        const carTagListChildren = carTagList.map((item, idx) => (
            <View style={[StylesExample.tagItemWrapper, { display: item.label == '库存预警' ? 'none' : 'flex' }]} key={idx} >
                <Tag
                    selected={item.isSelect}
                    onSelect={this.changeTag.bind(this, item)}
                    style={StylesExample.tagTextStyle}
                >
                    {item.label}({item.num})
                </Tag>
            </View>

        ))

        const filterItemConfig = [{
            key: 'sortFiled',
            title: '排序',
            renderComponent(data, onSelect) {
                return <Radio.List defaultValue={data ? data.value : ''} options={sortFiledList} onChange={(value, selected) => {
                    if (selected.value === '0') {
                        onSelect(null);
                        return;
                    }
                    onSelect(selected);
                }} />;
            },
        }, {
            key: 'extra',
            extra: true,
            title: '筛选',
            renderComponent(data, onSelect) {
                return <ColorAndTypeSelector
                    store={_th.store}
                    filterDefaultValue={filterDefaultValue}
                    defaultValue={data}
                    onSelect={(selected) => {
                        onSelect(selected);
                    }}
                    onTagClick={(selected) => { _th.onTagClick(selected, 'extra') }}
                    onSelectedCar={(carList) => { _th.onSelectedCar(carList) }}
                    resetSelectFn={(tagList, carList) => { _th.resetSelectFn(tagList, carList) }}
                />;
            },
        }];

        return (
            <View style={StylesExample.container}>
                { !isShowNavigation ?
                    <View style={StylesExample.hiddenView}>
                        <Text>{' '}</Text>
                    </View> : null
                }

                <Filter
                    itemConfig={filterItemConfig}
                    showSelectedArrow={true}
                    defaultValue={filterDefaultValue}
                    onChange={this.handleChange}
                    hideSpan={true}
                    store={_th.store}
                    filterDefaultValue={filterDefaultValue}
                >

                    <ScrollView automaticallyAdjustContentInsets={false}
                    alwaysBounceVertical={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={this._onRefresh}
                            />
                        }
                        onMomentumScrollEnd={this._contentViewScroll}
                        onScroll={this._onScroll}
                        onScrollBeginDrag={this._onScrollBeginDrag}
                        scrollEventThrottle={5}

                    >
                        { isGetStockCar ? 
                            <View style={StylesExample.tagStyle}>
                                {carTagListChildren}
                            </View>:
                            <View>
                                <TagSkeleton />
                            </View>
                        }
                        
                       
                        <View style={StylesExample.totalCar}>
                            <Text style={StylesExample.totalText}>共{pageInfo.totalNumber}台车</Text>
                        </View>

                        
                        { isGetStockAccountDet ? 
                            <View style={StylesExample.scrollViewContainer}>
                                {inventorySource.length > 0 ?
                                    <ListItem data={inventorySource} carTagList={carTagList} store={this.store} />
                                    :
                                    <View style={StylesExample.imgStyle}>
                                        <Image style={{
                                            width: 142,
                                            height: 142,
                                            marginTop: 120 / PixelRatio.get(),
                                        }}
                                            source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/empty-car.png' }} />
                                        <Text>暂无库存</Text>
                                    </View>
                                }
                            </View>:
                            <View>
                                <ListItemSkeleton />  
                            </View> 
                        } 
                    </ScrollView>
                </Filter>
            </View>
        )
    }
}


export default InventoryCarList;
