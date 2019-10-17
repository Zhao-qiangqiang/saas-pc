import React from 'react';


import { Easing,Animated,StyleSheet, View, Text, ScrollView, PixelRatio,TouchableOpacity,InteractionManager ,Image,FlatList,RefreshControl,Dimensions } from 'react-native';
import {
    SRNPage,
    observer,
    LifeCircle,
    SRNConfig
} from '@souche-f2e/srn-framework';
import {
    Form,
    Icon,
    toast,
    Color,
    Tabs,
    PullToRefreshFlatList,
    loading,
    Picker,
    Popover,
    Switch ,
    theme
} from '@souche-ui/srn-ui';
import SRNNative from '@souche-f2e/srn-native';
import _ from 'lodash';
import CarBrandSelect from '@souche-ui/RNCarBrandSelect';
import Table from '../stockCarList/components/Table';
import SearchPart from './component/Search';
import NavHelper from '@souche-f2e/srn-navigator';
import { CarModelSelect } from '../../shared/components/CarModel';
import stockStrcuture from '../../stores/stockStrcuture';
import carSelectModelStore from '../../stores/carSelectModelStore';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
//配置查询接口
const APIConfig = {
    //车辆列表查询
    GetThrCarSeriesCatalogByOrg: `${SRNConfig.pangolin}/pangolinEntrance/getThrCarSeriesCatalogByOrg.json`,
   
};

@LifeCircle
@observer
@toast


class StockStructure extends SRNPage {
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
            // component: ({ emitter, sceneProps }) => {
            //     return (
            //         <View style={stylesExample.searchHeaderRight}>
            //             <View style={stylesExample.searchHeaderRightSub}>
            //                 <Text
            //                     style={stylesExample.searchHeaderRightSubText}>
            //                     筛选
            //                 </Text>
            //             </View>
            //         </View>
            //     );
            // },
            // onPress: (emitter, sceneProps) => {
            //     // emitter.emit('initPage');
            //     emitter.emit('carSelectStructure');
            //     // NavHelper.push(CarModelSelect, {
            //     //     level: 3,
            //     //     emitter,
            //     //     title: '车系/车型',
            //     // });
            // }
        }
    }
    constructor(props){
        super(props);
        this.store = new stockStrcuture();
        this.carSelectModelStore = new carSelectModelStore();
        this.moveY = new Animated.Value(SCREEN_HEIGHT - 125)
        this.state = ({
            carSelectList:[],//筛选默认选中数据
            currentIndex: 1,
            isShowPicker:false,
            libraryAge : [], // 库龄统计
            fundStructure : [
                // {label:'车系',value:'carSeriesId'},
                {label:'金融车(台)',value:'financialCarCnt'},
                {label:'现金车(台)',value:'cashCarCnt'},
                {label:'金融车(元)',value:'facKpiJrpay'},
                {label:'现金车(元)',value:'facKpiXjpay'},
                {label:'资金合计(元)',value:'totalFunds'},
            ], // 资金结构
            undercutStructure : [
                // {label:'车系',value:'carSeriesId'},
                {label:'库存占比',value:'facInvKczb'},
                {label:'近6月销量',value:'facSale6cnt'},
                {label:'近3月销量',value:'facSale3cnt'},
                {label:'销售占比',value:'facInvXszb'},
            ], //车系结构
            monthSale : [
                // {label:'车系',value:'carSeriesId'},
                {label:'零售',value:'retail'},
                {label:'调拨',value:'transfer'},
                {label:'批发',value:'wholesale'},
                {label:'总计',value:'total'},
            ], //本月销售情况
            libraryRevolve : [
                // {label:'车系',value:'carSeriesId'},
                {label:'近6月',value:'facInv6Zhouz'},
                {label:'近3月',value:'facInv3Zhouz'},
                {label:'近1月',value:'facInv1Zhouz'},
            ], // 库存周转率
            choosedTar:[], // 选中的tab选项卡
            isShowSelect:false ,  //是否显示下拉选择
            tabList : [], // 选中的tab列表
            libraryAgeList:[], // 库龄统计列表
            fundStructureList:[], // 资金结构列表
            undercutStructureList:[], // 车系结构列表
            monthSaleList:[], //本月销售情况列表
            libraryRevolveList:[], // 库存周转率列表
            isShow:true, // 是否显示切换按钮
            isChoosed:1, // 默认车系
            sort:'Asc', // 默认降序
            carSeriesOrMode:'车系',
            isVisible:false,
            columnWidth:75
            // moveY:new Animated.Value(SCREEN_HEIGHT - 125),
        }) 
        this._handleAppend = this._handleAppend.bind(this);
        this.confirmPress = this.confirmPress.bind(this);
    }
    componentWillMount(){
        InteractionManager.runAfterInteractions(() => {
            //查询车型
            this.carSelectModelStore.GetThrSeriesCatalogByOrg({type:1,code:''})

            this.emitter.on('carSelectStructure',data=> {
                var carBrand = new CarBrandSelect();
                const { carBrandList } = this.carSelectModelStore
                const { carSelectList } = this.state
                if( carBrandList.length > 0){
                    NavHelper.push(carBrand.carSeries,{
                        unlimitedBrand:0,
                        unlimitedSeries:0,
                        selectType: 2,//多个车型 
                        detailType:1,
                        items:carSelectList,//默认值
                        brandApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=1&code=`,
                        seriesApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=2`,
                        modelApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=3`
                    });
                    
                }else{
                    NavHelper.push(carBrand.carSeries,{
                        unlimitedBrand:0,
                        unlimitedSeries:0,
                        selectType: 2,//多个车型 
                        detailType:1,
                        items:carSelectList,//默认值
                        showBrand: carBrandList[0],//只有一个品牌的时候直接打开车系
                        brandApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=1&code=`,
                        seriesApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=2`,
                        modelApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=3`
                    });
                }
        
                carBrand.onSelect((data)=>{
                    this.setState({
                        carSelectList:data.items
                    })
        
                    let lavel = 2
                    data.items && data.items[0].items && data.items[0].items[0].items && (lavel = 3)
                     
                    if(lavel == 2 ){
                        //如果是2级，选中之后查询车型具体列表，查询数据拿到所有车型 ，显示 已选择1个车型
                        this.carSelectModelStore.GetThrSeriesCatalogByOrg({
                            type:3,
                            code:data.items[0].items[0].code
                        }).then(res => {
                            if(res && res.length > 0){
                                //说明查询到数据了, 赋值
                                let list = Object
                                .keys(res || {})
                                .map(key => res[key].code)
                                .join(',')

                                this.store.filterChange(list,"MODELCODE")
                                this.store.getTabList(this.state.currentIndex)
                            }
                        })
                    }else{
                       //如果是3级，选中之后如果是一个，显示车型，多个显示多个车型
                      let res = data.items[0].items[0].items
                      let list = Object
                      .keys(res || {})
                      .map(key => res[key].code)
                      .join(',')
                        this.store.filterChange(list,"MODELCODE")
                        this.store.getTabList(this.state.currentIndex)
                       
                    }
                })
            })
        })
    }

    componentDidMount(){

        // 注射 把store 传到组件 以便调用store的方法
       this.emitter.emit('searchValue',{
           store:this.store,
           currentIndex:this.state.currentIndex
       })
        InteractionManager.runAfterInteractions(() => {
            // 获取库龄统计表头
            this.store.getlibraryAgeTitle()
            // this.store.getlibraryAgeList()
            this.store.onRefresh(1)
            // this.store.getcapitalStruct()
            // this.store.getundercutStructure()
            // this.store.getmonthSale()
            // this.store.getclibraryRevolve()
            this.initialize()


            //  筛选回调函数
            this.emitter.on('selectCarModel',data=>{
                this.selectCarModel(data)
            })
        });
    }

    // 筛选后回调
    selectCarModel(arr){
        NavHelper.pop()
        // console.log(arr)
        // this.store.filterChange(arr[0].brandCode,"CARBRANDFILTER")
        // this.store.filterChange(arr[1].seriesCode,"CARSERIESFILTER")
        if(arr.length){
            this.store.filterChange(arr[arr.length -1].modelCode,"MODELCODE")
            this.store.getTabList(this.state.currentIndex)
        }
    }
    
    // 页面初始化
    initialize(){
        this.setState({
            choosedTar:this.store.libraryAgeTitleList,
            libraryAge:this.store.libraryAgeTitleList,
            // libraryAgeList:this.store.libraryAgeList,
            // fundStructureList:this.store.fundStructureList,
            // undercutStructureList:this.store.undercutStructureList,
            // monthSaleList:this.store.monthSaleList,
            // libraryRevolveList:this.store.libraryRevolveList,
            tabList:this.store.libraryAgeList
        })
    }

    // 资金结构 下拉确认
    confirmPress(item){
        this.store.getCapitalStruct(item.label,"LABEL")
        this.store.getCapitalStruct(item.value,"VALUE")
        this.store.getCapitalStruct(item.chineseValue,"CHINESEVALUE")
        this.store.capitalStructSelect()
    }

    // 切换tab选项卡
    tabToggle(value){
        this.setState({
            columnWidth:75,
        })
        this.store.resetPage()
        let index = value + 1
        this.setState({
            currentIndex:index
        },()=>{
            this.emitter.emit('searchValue',{
           store:this.store,
           currentIndex:this.state.currentIndex
       })
        })
        switch (index) {
            case 1:
            this.setState({
                choosedTar:this.state.libraryAge,
                isShowSelect:false,
                isChoosed:1
            })
                this.store.onRefresh(index)
                break;
            case 2:
            this.setState({
                choosedTar:this.state.fundStructure,
                isShowSelect:true,
                isChoosed:1
            })
            this.store.onRefresh(index)
                break;
            case 3:
                this.setState({
                    choosedTar:this.state.undercutStructure,
                    isShowSelect:false,
                    isChoosed:1
                })
                this.store.onRefresh(index)
                break;
            case 4:
                this.setState({
                    choosedTar:this.state.monthSale,
                    isShowSelect:false,
                    isChoosed:1
                })
                this.store.onRefresh(index)
                break;
            case 5:
                this.setState({
                    choosedTar:this.state.libraryRevolve,
                    isShowSelect:false,
                    isChoosed:1
                })
                this.store.onRefresh(index)
                break;
        
            default:
                break;
        }
    }

    // 点击bar选项 排序
    tabBarChoosed(value){
        if(this.state.sort == 'Asc'){
            this.store.sortSearch("Desc",'SORTBYDESCORASCE')
            this.setState({
                sort:'Desc'
            })
        }else{
            this.store.sortSearch("Asc",'SORTBYDESCORASCE')
            this.setState({
                sort:'Asc'
            })
        }
        this.store.sortSearch(value,"SORTFILED")
        this.store.getTabList(this.state.currentIndex)
    }

    //  下拉刷新
    onRefresh(){
        this.store.resetPage()
        this.store.onRefresh(this.state.currentIndex)
    }

    // 点击单个列表信息
    item(value,index){
        console.log(value)
        let libraryAgeSeach = ''
        if(index == 'no'){
            if(this.state.currentIndex == 1 || this.state.currentIndex ==2){
                if(this.state.isChoosed == 1){
                    NavHelper.push("/InventoryCarList",{
                        carInfo:{
                            carTypeCode:'',
                            carSeriesFilter:value,
                            libraryAgeSeach:''
                        }
                    })
                }else{
                    NavHelper.push("/InventoryCarList",{
                        carInfo:{
                            carTypeCode:value,
                            carSeriesFilter:'',
                            libraryAgeSeach:''
                        }
                    })
                }
            }
        }else{
            if(this.state.currentIndex == 1){
                if(index == 0){
                    libraryAgeSeach = ''
                }else{
                    libraryAgeSeach = this.state.choosedTar.length > 0 ? this.state.choosedTar[index].chineseValue : ''
                }
                if(this.state.isChoosed == 1){
                    NavHelper.push("/InventoryCarList",{
                        carInfo:{
                            carTypeCode:'',
                            carSeriesFilter:value,
                            libraryAgeSeach
                        }
                    })
                }else{
                    NavHelper.push("/InventoryCarList",{
                        carInfo:{
                            carTypeCode:value,
                            carSeriesFilter:'',
                            libraryAgeSeach
                        }
                    })
                }
            }else if(this.state.currentIndex == 2){
                libraryAgeSeach = this.store.capitalStructValue.chineseValue
                if(this.state.isChoosed == 1){
                    NavHelper.push("/InventoryCarList",{
                        carInfo:{
                            carTypeCode:'',
                            carSeriesFilter:value,
                            libraryAgeSeach
                        }
                    })
                }else{
                    NavHelper.push("/InventoryCarList",{
                        carInfo:{
                            carTypeCode:value,
                            carSeriesFilter:'',
                            libraryAgeSeach
                        }
                    })
                }
            }
            
        }
    }

    renderItem(item){
        switch (this.state.currentIndex) {
            case 1:
            return (
                <View style={{flexDirection:'row',borderBottomColor:'#D7D8DB',borderBottomWidth:1,}}>
                    <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,0)}>
                            <View style={stylesExample.border}>
                                <Text>
                                    {item.libraryAge}
                                </Text>
                            </View>
                    </TouchableOpacity>
                       { this.store.libraryAgeTitleList.map((items,idx) => {
                           if(idx < this.store.libraryAgeTitleList.length -1){
                            return (<TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,idx + 1)}>
                                <View style={stylesExample.border}>
                                    <Text style={{textAlign:'right'}}>
                                        {/* {item.libraryAge} */}
                                        {item['libraryAge' + idx ]}
                                    </Text>
                                </View>
                            </TouchableOpacity>)
                           }
                        })}
              
                    


                    {/* <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,0)}>
                            <View style={stylesExample.border}>
                                <Text>
                                    {item.libraryAge}
                                </Text>
                            </View>
                    </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,1)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.libraryAge0}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,2)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.libraryAge1}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,3)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.libraryAge2}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,4)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.libraryAge3}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,5)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.libraryAge4}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,6)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.libraryAge5}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,7)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.libraryAge6}
                             </Text>
                         </View>
                     </TouchableOpacity> */}
                </View>
             )
                break;
            case 2:
            return (
                <View style={{flexDirection:'row',borderBottomColor:'#D7D8DB',borderBottomWidth:1,}}>
                    {/* <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.carSeriesName}
                             </Text>
                         </View>
                     </TouchableOpacity> */}
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,0)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.financialCarCnt}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,1)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.cashCarCnt}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,2)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facKpiJrpay}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,3)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facKpiXjpay}
                             </Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,4)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.totalFunds}
                             </Text>
                         </View>
                     </TouchableOpacity>
                </View>
            )
                break;
            case 3:
            return (
                <View style={{flexDirection:'row',borderBottomColor:'#D7D8DB',borderBottomWidth:1,}}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facInvKczb}%
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facSale6cnt}
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facSale3cnt}
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facInvXszb}%
                             </Text>
                         </View>
                </View>
            )
                break;
            case 4:
            return (
                <View style={{flexDirection:'row',borderBottomColor:'#D7D8DB',borderBottomWidth:1,}}>
                    {/* <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.carSeriesName}
                             </Text>
                         </View>
                     </TouchableOpacity> */}
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.retail}
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.transfer}
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.wholesale}
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.total}
                             </Text>
                         </View>
                </View>
            )
                break;
            case 5:
            return (
                <View style={{flexDirection:'row',borderBottomColor:'#D7D8DB',borderBottomWidth:1,}}>
                    {/* <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId)}>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.carSeriesName}
                             </Text>
                         </View>
                     </TouchableOpacity> */}
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facInv6Zhouz}
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facInv3Zhouz}
                             </Text>
                         </View>
                         <View  style={stylesExample.border}>
                             <Text>
                                 {item.facInv1Zhouz}
                             </Text>
                         </View>
                </View>
            )
                break;
            default:
                break;
        }
        
    }

    //  手指离开屏幕
    onTouchEnd(){
            this.setState({
                isShow:true
            })
        
    }

    // 手指触摸屏幕
    onTouchStart(){
            this.setState({
                isShow:false
            })
    }

    // 手指触摸屏幕
    onTouchStarst(){
            this.setState({
                isShow:true
            })
    }

    // 手指移动
    onTouchMove(){
        this.setState({
            isShow:false
        })
    }

    // 来回切换 车系/车型
    switchOne(){
        SRNNative.bury('NCI-Tools-InventoryStructure-Change', {});
        this.setState({
            isChoosed:1,
            carSeriesOrMode:'车系',
            columnWidth:75,
        })
        this.store.car_Series_ModeChange(1,this.state.currentIndex)
    }

    switchTwo(){
        SRNNative.bury('NCI-Tools-InventoryStructure-Change', {});
        this.setState({
            isChoosed:2,
            carSeriesOrMode:'车型',
            columnWidth:128,
        })
        this.store.car_Series_ModeChange(2,this.state.currentIndex)
    }

    // 上拉加载
    _handleAppend(){
        if(this.store.IsLastPage){
            return
        }else{
            this.store.handleAppend(this.state.currentIndex)
        }
    }

    _contentViewScroll(e){
        setTimeout(()=>{
            this.setState({
                isShow:true
            })
        },1000)
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (offsetY>0 && offsetY + oriageScrollHeight >= contentSizeHeight){
            console.log('上拉')
            if(this.store.IsLastPage){
                return
            }else{
                this.store.handleAppend(this.state.currentIndex)
            }
        }
    }
    onContentSizeChange(){
        setTimeout(()=>{
            this.setState({
                isShow:false
            })
        },1000)
    }

    render(){
        const content = (confirmPress)=>{
          return(
                <Popover.Menu>
                    {this.store.libraryAgeSelectList.map((item,index)=>{
                        return (
                            <Popover.Menu.Item key={index} onPress={() =>{  confirmPress && confirmPress(item) } }>{item.label}</Popover.Menu.Item>
                        )
                    })}
                </Popover.Menu>
                )}
        const titleBar = [
            {
                name:'库龄统计',
                key:1
            },
            {
                name:'资金结构',
                key:2
            },
            {
                name:'车系结构',
                key:3
            },
            {
                name:'本月销售情况',
                key:4
            },
            {
                name:'库存周转率',
                key:5
            },
        ];
        return (
            <View style={stylesExample.container}>
                <ScrollView showsHorizontalScrollIndicator={false} alwaysBounceHorizontal={false} bounces={false} horizontal={true} style={stylesExample.title}>
                    {titleBar.map((item,index)=>{
                        if(index == 0){
                            return (
                                <TouchableOpacity onPress={this.tabToggle.bind(this,index)}>
                                    <View style={[stylesExample.tabTitleCopy,this.state.currentIndex == index + 1 ? stylesExample.choosed : '']}>
                                        <Text style={[stylesExample.tabTitleTextCopy,this.state.currentIndex == index + 1 ? stylesExample.choosedText : '']}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }else{
                            return (
                                <TouchableOpacity onPress={this.tabToggle.bind(this,index)}>
                                    <View style={[stylesExample.tabTitle,this.state.currentIndex == index + 1 ? stylesExample.choosed : '']}>
                                        <Text style={[stylesExample.tabTitleTextCopy,this.state.currentIndex == index + 1 ? stylesExample.choosedText : '']}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        })}
                </ScrollView>
                <View style={stylesExample.showInfo}>
                    {this.state.isChoosed == 1 ? (<Text>共{this.store.tabBarLength}个车系</Text>) : (<Text>共{this.store.tabBarLength}个车型</Text>)}
                    {this.state.isShowSelect ? (
                        <Popover theme={'light'} content={content(this.confirmPress)} style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
                            <View style={{flexDirection:'row',paddingRight:28,alignItems:'center'}}>
                                <Text>{this.store.capitalStructValue.label}</Text>
                                <Icon type="caretDown" size="xxs"></Icon>
                            </View>
                        </Popover>) : (<Text></Text>) }
                </View>
                <ScrollView style={{height:SCREEN_HEIGHT}} onMomentumScrollBegin={this.onContentSizeChange.bind(this)} refreshControl={(<RefreshControl refreshing={this.store.isRefreshing} onRefresh={this.onRefresh.bind(this)}/>)} onMomentumScrollEnd={this._contentViewScroll.bind(this)} >
                    <View style={{flexDirection:'row',marginBottom:200}}>
                        <View>
                            {/* {this.store.tabList.length > 0 ? ( <View>
                                <TouchableOpacity onPress={this.tabBarChoosed.bind(this,("carSeriesId"))}>
                                                <View style={stylesExample.borderCopy}>
                                                    <Text style={{color:'#8D8E99'}}>
                                                        {this.state.carSeriesOrMode}
                                                    </Text>
                                                </View>
                                </TouchableOpacity>
                            </View>):(<Text></Text>)} */}
                            <View style={stylesExample.borderShoaw}>
                                <TouchableOpacity onPress={this.tabBarChoosed.bind(this,("carSeriesId"))}>
                                                <View style={stylesExample.tabBottomTitleCopy}>
                                                    <Text style={{color:'#8D8E99',fontSize:12}}>
                                                        {this.state.carSeriesOrMode}
                                                    </Text>
                                                </View>
                                </TouchableOpacity>
                            </View>
                            {this.store.tabBarLength > 0 ? this.store.tabList.map(item=>{
                                return (
                                    <View style={stylesExample.borderShoaw}>
                                        <TouchableOpacity onPress={this.item.bind(this,item.carSeriesId,'no')}>
                                            <View style={[stylesExample.borderCopy,{width:this.state.columnWidth}]}>
                                                <Text style={{fontSize:12}}>
                                                    {item.carSeriesName}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }) : <Text></Text>}
                        </View>
                        <ScrollView horizontal={true} alwaysBounceHorizontal={false} bounces={false} showsHorizontalScrollIndicator={false}>
                            <View style={{flexDirection:'column'}}>
                                <View style={{flex:1,flexDirection:'row',borderBottomColor:'#D7D8DB',borderBottomWidth:1,}}>
                                        {this.state.choosedTar.map(item=>{
                                        return (
                                            <TouchableOpacity onPress={this.tabBarChoosed.bind(this,(item.value))}>
                                                <View style={stylesExample.tabBottomTitle}>
                                                    <Text style={stylesExample.tabTitleText}>
                                                        {item.label}
                                                    </Text>
                                                    <View style={{justifyContent:'center'}}>
                                                        <View style={stylesExample.triangleTop}></View>
                                                        <View style={stylesExample.triangleBottom}></View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                        })}
                                </View>
                                {this.store.tabBarLength > 0 ? (this.store.tabList.map(item=>{
                                    return(
                                        this.renderItem(item)
                                    )
                                })):(<View>
                                    <Image style={{width: 100, height: 100}} source={require('../../img/noList.png')}></Image>
                                </View>) }
                                {/* <View style={{marginTop:10,textAlign:'center'}}>
                                    <Text style={{color:'#8D8E99',textAlign:'center'}}>{this.store.showText}</Text>
                                </View> */}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
                {/* <ScrollView onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)} style={{backgroundColor:'white'}} horizontal={true} alwaysBounceHorizontal={false} bounces={false} showsHorizontalScrollIndicator={false}>
                    <View>
                        <View style={{flexDirection:'row',height:60}}>
                            {this.state.choosedTar.map(item=>{
                             return (
                                 <TouchableOpacity onPress={this.tabBarChoosed.bind(this,(item.value))}>
                                     <View style={stylesExample.tabBottomTitle}>
                                         <Text style={stylesExample.tabTitleText}>
                                             {item.label}
                                         </Text>
                                         <View>
                                             <View style={stylesExample.triangleTop}></View>
                                             <View style={stylesExample.triangleBottom}></View>
                                         </View>
                                     </View>
                                 </TouchableOpacity>
                             )
                            })}
                        </View>
                        <View style={{marginBottom:200}}>
                            {this.store.tabBarLength > 0 ? (
                                    <FlatList
                                        data={this.store.tabList}
                                        renderItem={this.renderItem.bind(this)}
                                        // refreshControl={(
                                            //     <RefreshControl
                                            //         refreshing={this.store.isRefreshing}
                                            //         onRefresh={this.onRefresh.bind(this)}
                                            //     />
                                            // )}
                                            refreshing={this.store.isRefreshing}
                                            onRefresh={this.onRefresh.bind(this)}
                                            title={'加载中...'}
                                            titleColor={'red'}
                                            onEndReached={()=>this._handleAppend()}
                                            onEndReachedThreshold={0.5}
                                            ListFooterComponent={()=>(
                                                    <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                                                        <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,marginLeft:-100}}>
                                                            {this.store.showText}
                                                        </Text>
                                                    </View>
                                            )} 
                                            />
                                ): (<View>
                                <Image style={{width: 100, height: 100,marginLeft:(SCREEN_WIDTH-100)/2}} source={require('../../img/result.png')}></Image>
                            </View>)}
                        </View>
                    </View>
                </ScrollView> */}
                 {this.state.isShow ? (
                    <View style={stylesExample.fixed}>
                        <TouchableOpacity onPress={this.switchOne.bind(this)}>
                            <View style={[stylesExample.both,this.state.isChoosed == 1 ? stylesExample.currentBoth : '']}><Text style={[stylesExample.etxt,this.state.isChoosed == 1 ? stylesExample.currentEtxt : '']}>车系</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.switchTwo.bind(this)}>
                            <View style={[stylesExample.both,this.state.isChoosed == 2 ? stylesExample.currentBoth : '']}><Text style={[stylesExample.etxt,this.state.isChoosed == 2 ? stylesExample.currentEtxt : '']}>车型</Text></View>
                        </TouchableOpacity>
                    </View>
                ) : (<Text> </Text>)}
            </View>
        );
    }
}

const stylesExample = StyleSheet.create({
    container:{
        backgroundColor:'white',
        // backgroundColor:'#F2F2F2',
        // height:SCREEN_HEIGHT
    },
    title:{
        height:43,
        borderBottomColor:'#D9D9D9',
        borderBottomWidth:1,
    },
    tabTitle:{
        paddingVertical:15,
        backgroundColor:'white',
        justifyContent:'center',
        marginBottom:5,
        color:'#1A1A1A',
        marginRight:24
    },
    tabTitleCopy:{
        paddingVertical:15,
        backgroundColor:'white',
        justifyContent:'center',
        marginBottom:5,
        color:'#1A1A1A',
        marginLeft:10,
        marginRight:24
    },
    tabTitleText:{
        fontSize:12,
        textAlign:'center',
        color:'#8D8E99'
    },
    tabTitleTextCopy:{
        fontSize:14,
        textAlign:'center',
        color:'#1A1A1A'
    },
    showInfo:{
        paddingLeft:10,
        paddingTop:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:38,
        backgroundColor:'#F2F2F2',
    },
    tab:{
        backgroundColor:'white',
    },
    tabMiddle:{
        flexDirection:'column'
    },
    table:{
        flexDirection:'row',
    },
    tabBottomTitle:{
        width:75,
        height:44,
        textAlign:'center',
        flexDirection:'row',
        borderStyle:'solid',
        justifyContent:'flex-end',
        alignItems:'center',
        marginRight:35,
    },
    tabBottomTitleCopy:{
        width:75,
        height:44,
        justifyContent:'center',
        alignItems:'flex-start',
        borderStyle:'solid',
        paddingLeft:16,
        color:'#1A1A1A'
    },
    border:{
        width:75,
        borderStyle:'solid',
        justifyContent:'flex-end',
        alignItems:'center',
        height:60,
        flexDirection:'row',
        marginRight:35
    },
    borderCopy:{
        
        justifyContent:'flex-start',
        alignItems:'center',
        height:60,
        paddingLeft:16,
        paddingRight:8,
        flexDirection:'row',
    },
    borderShoaw:{
        borderBottomColor:'#D7D8DB',
        borderBottomWidth:1,
        borderRightColor:'#D7D8DB',
        borderRightWidth:1,
        shadowColor: '#D7D8DB',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
    },
    fundStructureChoose:{
        flexDirection:'row'
    },
    triangleTop:{
        width:0,
        height:0,
        borderStyle:'solid',
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
        borderRightWidth: 4,
        borderRightColor: 'transparent',
        borderBottomWidth: 4,
        borderBottomColor: 'gray',
        marginTop:2,
        marginBottom:1
    },
    triangleBottom:{
        width:0,
        height:0,
        borderStyle:'solid',
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
        borderRightWidth: 4,
        borderRightColor: 'transparent',
        borderTopWidth: 4,
        borderTopColor: 'gray'
    },
    triangleBottomMargin:{
        marginTop:3
    },
    choosed:{
        borderBottomColor:'#FF571A',
        borderBottomWidth:2,
    },
    choosedText:{
        color:'#1B1C33',
        fontWeight:'700'
    },
    fixed:{
        position:'absolute',
        top:SCREEN_HEIGHT - 160,
        left:(SCREEN_WIDTH -120)/2,
        justifyContent:'center',
        flexDirection:'row',
        borderRadius:30,
        borderColor:"#F5F5F5",
        borderStyle:'solid',
        borderWidth:1,
        backgroundColor:'white',
        height:35,
    },
    both:{
        width:60,
        borderRadius:30,
        textAlign:'center',
        margin:5,
        paddingHorizontal:10,
        paddingVertical:5,
        alignContent:'center'
    },
    currentBoth:{
        backgroundColor:'#F5F5F5',
        borderWidth:1,
        borderColor:"#F5F5F5",
        borderStyle:'solid',
    },  
    etxt:{
        color:'#8D8E99',
        textAlign:'center'
    },
    currentEtxt:{
        color:'#FF571A',
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
});

export default StockStructure;