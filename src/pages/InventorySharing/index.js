import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    NativeModules,
    InteractionManager,
    DatePickerIOS,
    Dimensions,
    PixelRatio,
    ScrollView,
    TouchableOpacity,
    CameraRoll,
    FlatList,
    AsyncStorage,
    Platform,
} from 'react-native';


import { SRNPage, observer, LifeCircle, SRNConfig } from '@souche-f2e/srn-framework';
import NavHelper from '@souche-f2e/srn-navigator';
import { Input, Form, Icon, Button, WingBlank, toast, loading } from '@souche-ui/srn-ui';
import SRNNative from '@souche-f2e/srn-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
// import SearchList from '../SearchList/index';
import InventorySharingStore from '../../stores/InventorySharing';
import SearchList from './component/SearchList';
import SearchResult from './component/SearchResult';
import { BLKSRNFetch } from '../../shared/utils';
import CarBrandSelect from '@souche-ui/RNCarBrandSelect';

const APIConfig = {
    CARLIST_API: `${
        SRNConfig.pangolin
        }/pangolinEntrance/getThrCarSeriesCatalogByOrg.json`,  // 车型列表接口
};


@observer
class inventoryShare extends SRNPage {
    static navigation = {
        title: {
            text: '库存共享查询',
        },
        left: {
            showArrow: true,
            onPress: function () {
                NavHelper.pop()
            }
        }
    };

    constructor(props) {
        super(props);
        this.store = new InventorySharingStore();
        this.state = {
            title: "",
            carSelectList: [], // 接受车型选择回调后的数组
            searchChooseHistory: [], // 历史查询记录
            userId:''
        }
    }


    componentDidMount() {
        // 先查询是否只有一个品牌
        this.store.getCarBrand(1)
        this.store.getUserId().then(res=>{
            this.setState({
                userId:res
            })
            // 如果有查询记录 就展示
            if (AsyncStorage.getItem(res)) {
                AsyncStorage.getItem(res).then(val => {
                    let arr = JSON.parse(val)
                    console.log(arr)
                    let timestamp = new Date().getTime()
                    // let oneMonthTime = 60 * 1000
                    let oneMonthTime = 30 * 24 * 60 * 60 * 1000
                    arr.forEach((item, index) => {
                        if (item.time + oneMonthTime < timestamp) {
                            arr.splice(index, 1)
                        }
                    })
                    this.setState({  
                        searchChooseHistory: arr
                    })
                })
            }
        })
    }

    // 查询
    searchList = () => {
        const { searchChoose } = this.store
        if (this.store.searchChoose.carModelName == "必选" || !this.store.searchChoose.carModelId) {
            SRNNative.toast("请选择车型!",2000)
        } else {
            NavHelper.push(SearchResult,{
                store:this.store,
                tag:'1'
            })
            this.store.resetResult()
            this.saveSearchType(searchChoose)
        }
    }

    // 存储客户搜索记录 
    saveSearchType = (val) => {
        const { searchChooseHistory,userId } = this.state
        let array = []

        let timestamp = new Date().getTime()
        let obj = {
            ...val,
            time: timestamp,
        }
        array.unshift(obj)

        if (searchChooseHistory.length > 0) {
            searchChooseHistory.forEach((item, index) => {
                let isSame = this.findSameSearch(item, val)

                if (isSame) {
                    searchChooseHistory.splice(index, 1)
                }
                let arr = array.concat(searchChooseHistory).slice(0, 20)
                this.setState({
                    searchChooseHistory:arr
                })
                AsyncStorage.setItem(userId, JSON.stringify(arr))
            });
        } else {
            this.setState({
                searchChooseHistory: array
            })
            AsyncStorage.setItem(userId, JSON.stringify(array))
        }
    }

    // 判断搜索的是否有同一历史记录
    findSameSearch = (x, y) => {
        let isSame = null
        if (x.carModelId == y.carModelId && x.exteriorColorId == y.exteriorColorId && x.interiorColorId == y.interiorColorId && x.orgId == y.orgId) {
            isSame = true
        } else {
            isSame = false
        }
        return isSame
    }

    // 车型筛选
    carModelChange = () => {
        const { carSelectList } = this.state
        // 车型选择的切换 
        this.store.resetSearch()
        var carBrand = new CarBrandSelect();
        if (this.store.isOneBrand) {
            NavHelper.push(carBrand.carSeries, {
                brandApi: `${APIConfig.CARLIST_API}?type=1&code=`,
                seriesApi: `${APIConfig.CARLIST_API}?type=2`,
                modelApi: `${APIConfig.CARLIST_API}?type=3`,
                selectType: 1,
                unlimitedBrand: 0,
                unlimitedSeries: 0,
                unlimitedModels: 0,
                items: carSelectList,//默认值
                showBrand: this.store.oneBrand
            });
        } else {
            NavHelper.push(carBrand.carSeries, {
                brandApi: `${APIConfig.CARLIST_API}?type=1&code=`,
                seriesApi: `${APIConfig.CARLIST_API}?type=2`,
                modelApi: `${APIConfig.CARLIST_API}?type=3`,
                selectType: 1,
                unlimitedBrand: 0,
                unlimitedSeries: 0,
                unlimitedModels: 0,
                items: carSelectList,//默认值
            });
        }

        carBrand.onSelect((data) => {
            this.setState({
                carSelectList: data.items
            })
            this.selected(data.items)
            console.log("select brand:", data.items);
        })

    }

    // 获取筛选后信息
    selected = (arr) => {
        console.log(arr);

        this.store.carChangeFocus()
        this.store.getSearchInfo(arr[0].items[0].items[0].code, "CARMODELID");
        this.store.getSearchInfo(arr[0].items[0].items[0].name, "CARMODENAME");
        this.store.getSearchInfo(arr[0].code, "CARBRANDID");
        if (arr) {
            this.store.getColorData()
            this.store.getDelearData()  // 接口通了在放开 否则页面会报错
        } else {
            SRNNative.confirm({
                title: '提示',
                text: "车型选择失败!",
                rightButton: '确认'
            })
        }
    }

    // 内饰色 车顶色 经销商 查询方法列表
    chooseChange = (condition) => {
        if (this.store.searchChoose.carModelName == "必选" || !this.store.searchChoose.carModelId) {
            SRNNative.toast("请选择车型!",2000)
        } else {
            NavHelper.push(SearchList, {
                condition,
                store: this.store,
            })
        }
    }

    //  点击历史记录  查询
    goResult = (data) => {
        // 此处重置是为了防止 flatList 同样的数据时  视图不会更新
        this.store.resetResult()

        NavHelper.push(SearchResult,{
            store:this.store,
            tag:'2'
        })

        // 点击历史记录后在走一遍存储方法
        this.saveSearchType(data)

        this.store.getSearchHistoryInfo(data.carModelName,'CARMODENAME')
        this.store.getSearchHistoryInfo(data.carModelId,'CARMODELID')
        this.store.getSearchHistoryInfo(data.exteriorColorId,'EXTERIORCOLORID')
        this.store.getSearchHistoryInfo(data.interiorColorId,'INTERIORCOLORID')
        this.store.getSearchHistoryInfo(data.orgId,'ORGID')
    }

    render() {
        const {searchChoose} = this.store;
        return (
            <View style={{flex:1}}>
                <Form>
                    <Form.Item title="车型"  onPress={this.carModelChange.bind(this)}>
                        <Text autoHeight={true} type="textarea" style={searchChoose.carModelId ? {color: '#1C1C1C'} : {color: '#FF571A'} }>
                            {searchChoose.carModelName}
                        </Text>
                        <Icon type="angleRight" size="md" />
                    </Form.Item>
                    <Form.Item title="车身色" onPress={this.chooseChange.bind(this, "carModelColor")}>
                        <Text style={searchChoose.exteriorColor != '请选择' ? {color: '#1C1C1C'} : {color: '#B5B5B5'} }>
                            {searchChoose.exteriorColor}
                        </Text>
                        <Icon type="angleRight" size="md" />
                    </Form.Item>
                    <Form.Item title="内饰色" onPress={this.chooseChange.bind(this, "carModelInColor")}>
                        <Text style={searchChoose.interiorColor != '请选择' ? {color: '#1C1C1C'} : {color: '#B5B5B5'} }>
                            {searchChoose.interiorColor}
                        </Text>
                        <Icon type="angleRight" size="md" />
                    </Form.Item>
                    <Form.Item title="经销商" onPress={this.chooseChange.bind(this, "delear")}>
                        <Text autoHeight={true} type="textarea" style={searchChoose.dealer != '请选择' ? {color: '#1C1C1C'} : {color: '#B5B5B5'} }>
                            {searchChoose.dealer}
                        </Text>
                        <Icon type="angleRight" size="md" />
                    </Form.Item>
                    <Button type="primary" style={styles.search} onPress={this.searchList}>
                        查询
                    </Button>
                </Form>

                {this.state.searchChooseHistory.length > 0 ? (
                    <View style={{flex:1}}>
                        <View style={{paddingHorizontal:'5%',marginBottom:8}}><Text style={{ color: '#B5B5B5' }}>查询记录</Text></View>
                            <ScrollView style={{flex:1}}>
                                {console.log(this.state.searchChooseHistory)}
                                {this.state.searchChooseHistory.map(item => {
                                    return (
                                        <TouchableOpacity onPress={this.goResult.bind(this, item)}>
                                            <View style={styles.color}>
                                                <View>
                                                    <View>
                                                        <Text style={styles.carColor}>{item.carModelName}</Text>
                                                    </View>
                                                    <View style={styles.detail}>
                                                        <Text style={styles.textColor}>{item.exteriorColor == '不限颜色' ? '外观不限' : item.exteriorColor != '请选择' ? `外观${item.exteriorColor}` : ''}</Text>
                                                        {item.exteriorColor == '请选择' || item.interiorColor == '请选择' ? null : <Text style={styles.textColor}> | </Text>}
                                                        <Text style={styles.textColor}>{item.interiorColor == '不限颜色'  ? '内饰不限' : item.interiorColor != '请选择' ? `内饰${item.interiorColor}` :''}</Text>
                                                        {item.interiorColor == '请选择' || item.dealer == '请选择' ? null : <Text style={styles.textColor}> | </Text>}
                                                        <Text style={styles.textColor}> {item.dealer == '不限组织' ? '组织不限' : item.dealer != '请选择' ? item.dealer : ''}</Text>
                                                    </View>
                                                </View>
                                                <Icon type="angleRight" size="md"></Icon>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                    </View>
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        // paddingHorizontal:'3%'
        // flex:1
    },
    search: {
        borderRadius: 44,
        // marginTop:10,
        // width:SCREEN_WIDTH*0.9,
        // marginBottom:0,
        // marginLeft:"auto",
        // marginRight:"auto",
        marginHorizontal: 16,
        marginVertical: 20,
        height: 45
    },
    color: {
        paddingHorizontal: '5%',
        paddingVertical: 15,
        borderBottomColor: "#E8E8E8",
        borderBottomWidth: 1,
        borderStyle: 'solid',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detail: {
        flexDirection: 'row',
        marginTop: 8
    },
    textColor: {
        color: '#B5B5B5',
        fontSize: 12
    },
    carColor: {
        color: '#1C1C1C',
        fontSize: 14
    }
});
export default inventoryShare