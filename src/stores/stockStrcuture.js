import {
    SRNStore,
    observable,
    action,
    SRNConfig
} from '@souche-f2e/srn-framework';
import InventorySharingModel from '../models/InventorySharingModel';
import {
    BLKSRNFetch
} from '../shared/utils';
import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';

const APIConfig = {
    libraryAgeTitle_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getLibraryAgeLabel.json`, // 库龄统计表头

    // 车系
    libraryAgeList_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getResAgeStruct.json`, // 库龄统计查询列表
    capitalStruct_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getCapitalStruct.json`, //资金结构
    vehicleModelStruct_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getVehicleModelStruct.json`, //车系结构
    salesMonthDtoPage_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getSalesMonthDtoPage.json`, //本月销售情况
    inventoryTurnoverDtoPage_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getInventoryTurnoverDtoPage.json`, //库存周转率

};

const APIConfigModeCar = {
    // 车型
    libraryAgeList_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getResAgeStructToCarType.json`, // 库龄统计查询列表
    capitalStruct_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getCapitalStructToCarType.json`, //资金结构
    vehicleModelStruct_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getVehicleModelStructToCarType.json`, //车系结构
    salesMonthDtoPage_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getSalesMonthDtoPageToCarType.json`, //本月销售情况
    inventoryTurnoverDtoPage_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getInventoryTurnoverDtoPageToCarType.json` //库存周转率
}

const capitalStructValueMap = {
    "LABEL":'label',
    "VALUE":'value',
    "CHINESEVALUE":'chineseValue',
}
const filterMap = {
    "MODELCODE":'modelCode',
    "CARBRANDFILTER":'carBrandFilter',
    "CARSERIESFILTER":'carSeriesFilter',
}
const sortMap = {
    "SORTFILED":'sortFiled',
    "SORTBYDESCORASCE":'sortByDescOrAsce',
}

class stockStrcuture extends SRNStore {
    // 搜索字段
    @observable searchValue = ""

    @observable sort = {
        sortFiled:'',
        sortByDescOrAsce : "Asc"
    }

     // 库龄统计表头 
     @observable libraryAgeTitleList = []

     // 筛选字段
     @observable filter = {
        modelCode:'',  // 车型
        carBrandFilter:'',  // 品牌
        carSeriesFilter:'',  // 车系
     }

     // 车系or车型   1: 车系     2: 车型    默认 1
     @observable carSeriesOrCarMode = 1

     // 资金结构下拉列表
     @observable libraryAgeSelectList = []

    // 列表
     @observable tabList = []


     @observable showText = "正在加载中"

    // // 库龄统计tab列表
    // @observable libraryAgeList = []

    // // 资金结构tab列表
    // @observable fundStructureList = []

    // // 车系结构tab列表
    // @observable undercutStructureList = []

    // // 本月销售情况tab列表
    // @observable monthSaleList = []

    // // 库存周转率tab列表
    // @observable libraryRevolveList = []

    // tab 列表长度
    @observable tabBarLength = 0

     // 资金结构 下拉值
     @observable capitalStructValue = {
         label:'',
         value:'',
         chineseValue:''
     }

     // 所有tab分页
     @observable page = 1

     // 是否是最后一页
     @observable IsLastPage = false

     // 是否下拉
     @observable isRefreshing = false

     // 是否上拉
     @observable finish = false
    
     // 下拉值改变
     @action
     getCapitalStruct(val, numVal) {
         this.capitalStructValue[capitalStructValueMap[numVal]] = val
     }

    // 获取库龄统计表头  以及资金结构下拉列表
    @action 
    getlibraryAgeTitle(){
        return BLKSRNFetch(APIConfig.libraryAgeTitle_API,{
            method:'GET',
            data:{}
        }).then(res=>{
            for(var i = 0;i<res.length;i++){ 
                if(i == 0 ){
                    let obj = {
                        label: `${res[i].startDate}天以上` ,
                        value: res[i].rowNumber,
                        chineseValue:res[i].libraryAge
                    }
                    // this.getCapitalStruct(obj.label,"LABEL")
                    // this.getCapitalStruct(obj.value,"VALUE")
                    // this.getCapitalStruct(obj.chineseValue,"CHINESEVALUE")
                    //下拉列表添加全部选项
                    this.getCapitalStruct('全部',"LABEL")
                    this.getCapitalStruct('',"VALUE")
                    this.getCapitalStruct('',"CHINESEVALUE")

                    this.libraryAgeSelectList.push(obj)
                    this.libraryAgeTitleList.push(obj)
                }else{
                    let obj = {
                        label: `${res[i].startDate} - ${res[i].endDate}天` ,
                        value: res[i].rowNumber,
                        chineseValue:res[i].libraryAge
                    }
                    this.libraryAgeSelectList.push(obj)
                    this.libraryAgeTitleList.push(obj)
                }
            }
            let obj2 = {
                label:'平均库龄',
                value:'libraryAge',
                chineseValue:'平均库龄'
            }
            let allLibraryAgeSelect = {
                label:'全部',
                value:'',
                chineseValue:''
            }
            
            this.libraryAgeSelectList.unshift(allLibraryAgeSelect)
            
            this.libraryAgeTitleList.unshift(obj2)
            console.log(this.libraryAgeTitleList)
        }).catch(err=>{
            SRNNative.confirm({
                title:'提示',
                text: err.msg,
                rightButton: '确认',
            })   
        })
    }

    // 获取库龄统计列表
    @action
    getlibraryAgeList(){
        let url = ''
        if(this.carSeriesOrCarMode == 1){
            url = APIConfig.libraryAgeList_API
        }else{
            url = APIConfigModeCar.libraryAgeList_API
        }
        BLKSRNFetch(url,{
            method: 'POST',
            json: {
                page: this.page,
                pageSize: 10,
                carSearch:this.searchValue,
                modelCode:this.filter.modelCode,
                carBrandFilter:this.filter.carBrandFilter,
                carSeriesFilter:this.filter.carSeriesFilter,
                sortFiled:this.sort.sortFiled,
                sortByDescOrAsce:this.sort.sortByDescOrAsce,
            }
        }).then(res=>{
            console.log(res)
            this.isRefreshing = false
            SRNNative.Loading.hide()
            this.tabBarLength = res.totalNumber
            if(res.items.length > 0){
                if(res.currentIndex == res.totalPage){
                    this.IsLastPage = true
                    this.showText = "没有更多数据了"
                }
                this.page += 1
                this.tabList = this.tabList.concat(res.items)
                console.log(this.tabList)
            }else{
                 SRNNative.toast({
                    text:'暂无数据'
                 })
                 this.showText = "暂无数据"   
            }
        }).catch(err=>{
            console.log(err)
            SRNNative.confirm({
                title:'提示',
                text: err.msg,
                rightButton: '确认',
            })   
            this.showText = "没有请求到数据"   
        })
    }

    //获取资金结构列表
    @action
    getcapitalStruct(){
        let url = ''
        if(this.carSeriesOrCarMode == 1){
            url = APIConfig.capitalStruct_API
        }else{
            url = APIConfigModeCar.capitalStruct_API
        }
        BLKSRNFetch(url,{
            method: 'POST',
            json: {
                page: this.page,
                pageSize: 10,
                carSearch:this.searchValue,
                modelCode:this.filter.modelCode,
                carBrandFilter:this.filter.carBrandFilter,
                carSeriesFilter:this.filter.carSeriesFilter,
                sortFiled:this.sort.sortFiled,
                sortByDescOrAsce:this.sort.sortByDescOrAsce,
                libraryAgeSeach:this.capitalStructValue.chineseValue
            }
        }).then(res=>{
            console.log(res)
            this.isRefreshing = false
            this.tabBarLength = res.totalNumber
            SRNNative.Loading.hide()
            if(res.items.length > 0){
                if(res.currentIndex == res.totalPage){
                    this.IsLastPage = true
                    this.showText = "没有更多数据了"
                }
                this.page += 1
                this.tabList = this.tabList.concat(res.items)
            }else{
                 SRNNative.toast({
                    text:'暂无数据'
                 })  
                 this.showText = "暂无数据" 
            }
        }).catch(err=>{
            SRNNative.confirm({
                title:'提示',
                text: err.msg,
                rightButton: '确认',
            })   
            this.showText = "没有请求到数据"   
        })
    }

    //获取车系结构列表
    @action
    getundercutStructure(){
        let url = ''
        if(this.carSeriesOrCarMode == 1){
            url = APIConfig.vehicleModelStruct_API
        }else{
            url = APIConfigModeCar.vehicleModelStruct_API
        }
        BLKSRNFetch(url,{
            method: 'POST',
            json: {
                page: this.page,
                pageSize: 10,
                carSearch:this.searchValue,
                modelCode:this.filter.modelCode,
                carBrandFilter:this.filter.carBrandFilter,
                carSeriesFilter:this.filter.carSeriesFilter,
                sortFiled:this.sort.sortFiled,
                sortByDescOrAsce:this.sort.sortByDescOrAsce
            }
        }).then(res=>{
            console.log(res)
            this.isRefreshing = false
            this.tabBarLength = res.totalNumber
            SRNNative.Loading.hide()
            if(res.items.length > 0){
                if(res.currentIndex == res.totalPage){
                    this.IsLastPage = true
                    this.showText = "没有更多数据了"
                }
                this.page += 1
                this.undercutStructureList = res.items
                this.tabList = this.tabList.concat(res.items)
            }else{
                 SRNNative.toast({
                    text:'暂无数据'
                 })   
                 this.showText = "暂无数据"
            }
        }).catch(err=>{
            SRNNative.confirm({
                title:'提示',
                text: err.msg,
                rightButton: '确认',
            })   
            this.showText = "没有请求到数据"   
        })
    }
    //获取本月销售情况列表
    @action
    getmonthSale(){
        let url = ''
        if(this.carSeriesOrCarMode == 1){
            url = APIConfig.salesMonthDtoPage_API
        }else{
            url = APIConfigModeCar.salesMonthDtoPage_API
        }
        BLKSRNFetch(url,{
            method: 'POST',
            json: {
                page: this.page,
                pageSize: 10,
                carSearch:this.searchValue,
                modelCode:this.filter.modelCode,
                carBrandFilter:this.filter.carBrandFilter,
                carSeriesFilter:this.filter.carSeriesFilter,
                sortFiled:this.sort.sortFiled,
                sortByDescOrAsce:this.sort.sortByDescOrAsce
            }
        }).then(res=>{
            console.log(res)
            this.isRefreshing = false
            this.tabBarLength = res.totalNumber
            SRNNative.Loading.hide()
            if(res.items.length > 0){
                if(res.currentIndex == res.totalPage){
                    this.IsLastPage = true
                    this.showText = "没有更多数据了"
                }
                this.page += 1
                this.monthSaleList = res.items
                this.tabList = this.tabList.concat(res.items)
            }else{
                 SRNNative.toast({
                    text:'暂无数据'
                 })  
                 this.showText = "暂无数据" 
            }
        }).catch(err=>{
            SRNNative.confirm({
                title:'提示',
                text: err.msg,
                rightButton: '确认',
            })   
            this.showText = "没有请求到数据"   
        })
    }
    //获取库存周转率列表
    @action
    getclibraryRevolve(){
        let url = ''
        if(this.carSeriesOrCarMode == 1){
            url = APIConfig.inventoryTurnoverDtoPage_API
        }else{
            url = APIConfigModeCar.inventoryTurnoverDtoPage_API
        }
        BLKSRNFetch(url,{
            method: 'POST',
            json: {
                page: this.page,
                pageSize: 10,
                carSearch:this.searchValue,
                modelCode:this.filter.modelCode,
                carBrandFilter:this.filter.carBrandFilter,
                carSeriesFilter:this.filter.carSeriesFilter,
                sortFiled:this.sort.sortFiled,
                sortByDescOrAsce:this.sort.sortByDescOrAsce
            }
        }).then(res=>{
            console.log(res)
            this.isRefreshing = false
            this.tabBarLength = res.totalNumber
            SRNNative.Loading.hide()
            if(res.items.length > 0){
                if(res.currentIndex == res.totalPage){
                    this.IsLastPage = true
                    this.showText = "没有更多数据了"
                }
                this.page += 1
                this.libraryRevolveList = res.items
                this.tabList = this.tabList.concat(res.items)
            }else{
                 SRNNative.toast({
                    text:'暂无数据'
                 })
                 this.showText = "暂无数据"
            }
        }).catch(err=>{
            SRNNative.confirm({
                title:'提示',
                text: err.msg,
                rightButton: '确认',
            })   
            this.showText = "没有请求到数据"   
        })
    }

    // 下拉刷新 (page=1)
    @action
    onRefresh(index){
        this.page = 1 
        this.tabList = []
        this.IsLastPage = false
        this.tabBarLength = 0
        this.getTabList(index)
    }

    // 上拉加载功能
    @action
    handleAppend(index){
        if(this.IsLastPage){
            return
        }else{
            this.getTabList(index)
        }
    }

    // 调用列表接口
    @action
    getTabList(index){
        SRNNative.Loading.show({
            text: '加载中',
            icon:'waiting'
        }) 
        this.isRefreshing = true
        switch (index) {
            case 1:
            this.getlibraryAgeList()
                break;
            case 2:
            this.getcapitalStruct()
                break;
            case 3:
            this.getundercutStructure()
                break;
            case 4:
            this.getmonthSale()
                break;
            case 5:
            this.getclibraryRevolve()
                break;
            default:
                break;
        }
    }

    // 重置
    @action
    resetPage(){
        this.page = 1
        this.tabList = []
        this.IsLastPage = false
        this.showText = '正在加载中'
        this.sort.sortFiled = ''
        this.sort.sortByDescOrAsce = "Asc"
        // this.filter.modelCode = ''
        // this.filter.carBrandFilter = ''
        // this.filter.carSeriesFilter = ''
        // this.searchValue = ''
        this.carSeriesOrCarMode = 1
        this.tabBarLength = 0
    }

    //搜索关键字
    @action
    valueSearch(value,index){
        this.tabBarLength = 0
        this.page = 1 
        this.tabList = []
        this.IsLastPage = false
        this.searchValue = value
        this.getTabList(index)
    }

    // 筛选字段改变
    @action
    filterChange(val,numVal){
        this.filter[filterMap[numVal]] = val
        this.tabBarLength = 0
        this.page = 1
        this.tabList = []
        this.IsLastPage = false 
    }

    // 排序字段 绑定
    @action
    sortSearch(val,numVal){
        this.page = 1 
        this.tabList = []
        this.tabBarLength = 0
        this.IsLastPage = false
        this.sort[sortMap[numVal]] = val
    }

    // 车型车系切换
    @action
    car_Series_ModeChange(index,currentIndex){
        this.resetPage()
        this.carSeriesOrCarMode = index
        this.getTabList(currentIndex)
    }

    // 资金结构 下拉查询
    @action
    capitalStructSelect(){
        SRNNative.Loading.show({
            text: '加载中',
            icon:'waiting'
        }) 
        this.isRefreshing = true
        this.page = 1 
        this.tabList = []
        this.tabBarLength = 0
        this.IsLastPage = false
        this.getcapitalStruct()
    }
    
}


export default stockStrcuture;