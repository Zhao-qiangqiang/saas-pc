import {
    SRNStore,
    observable,
    action,
    SRNConfig
} from '@souche-f2e/srn-framework';
import {
    Platform,
    Modal
} from 'react-native';
import {
    BLKSRNFetch
} from '../shared/utils';
import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';


const isIos = Platform.OS == 'android' ? false : true

const searchChooseMap = {
    "CARMODENAME": "carModelName",
    "CARMODELID": "carModelId",
    "CARBRANDID": "carBrandId",
    "EXTERIORCOLOR": 'exteriorColor',
    "EXTERIORCOLORID": 'exteriorColorId',
    "INTERIORCOLOR": "interiorColor",
    "INTERIORCOLORID": "interiorColorId",
    "DEALER": "dealer",
    "ORGID": "orgId",
}

const historyChooseMap = {
    "CARMODENAME": "carModelName",
    "CARMODELID": "carModelId",
    "EXTERIORCOLORID": 'exteriorColorId',
    "INTERIORCOLORID": "interiorColorId",
    "ORGID": "orgId",
}

const APIConfig = {
    JUDGE_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getUserIdAndOrgId.json`,  // 判断是否是统一id
    CARMODEL_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/queryModelColorByModelCode.json`,  // 获取车身色,内饰色
    DELEAR_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/listShopByCarBrandlId.json`, // 获取经销商
    SEARCH_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/pageInventoryShareByQuery.json`, // 查询结果列表
    CARLIST_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getThrCarSeriesCatalogByOrg.json`,  // 车型列表接口
};

class InventorySharingStore extends SRNStore {
    @observable isSEARCH_API = false
    // 查询条件
    @observable searchChoose = {
        carModelName: '必选',
        carModelId: '',
        carBrandId : '',
        exteriorColor: '请选择',
        exteriorColorId: '',
        interiorColor: '请选择',
        interiorColorId: '',
        dealer: "请选择",
        orgId: '',
    }

   // 点击历史记录时暂存字段 (为了使查询条件不被重新赋值区分历史记录还是查询条件)
   @observable historyChoose = {
        carModelName: '',
        carModelId:'',
        exteriorColorId:'',
        interiorColorId:'',
        orgId:''
   }


    // 搜索分页
    @observable pageInfo = {
        page: 1,
        pageSize: 10,
    }

    // 是否是最后一页
    @observable IsLastPage = false

    //是否下拉
    @observable refreshing = true

    // 数据源
    @observable resultList = []

    // 外饰色
    @observable carColorList = []

    // 内饰色
    @observable carInColorList = []

    // 经销商
    @observable dealerList = []

    // 只有一个品牌
    @observable oneBrand = {}

    // 是否只有一个品牌
    @observable isOneBrand = false

    // 不同门店是保存不同的id
    @observable userId = ""

    @action 
    isSEARCH_APIChange(data){
        this.isSEARCH_API = data
    }
    // 获取查询信息
    @action
    getSearchInfo(val, numVal) {
        this.searchChoose[searchChooseMap[numVal]] = val
    }

    // 获取历史记录查询信息
    @action
    getSearchHistoryInfo(val, numVal) {
        this.historyChoose[historyChooseMap[numVal]] = val
    }

    // 页面加载完成调用是否只有一个品牌
    @action
    getCarBrand(val){
        BLKSRNFetch(APIConfig.CARLIST_API,{
            method:'GET',
            data:{
                type:val,
                code:''
            }
        }).then(res=>{
            console.log(res)
            if(res.items[0].row.length == 1){
                this.oneBrand = res.items[0].row[0]
                this.isOneBrand = true
            }else{
                this.isOneBrand = false
            }
        })
    }

      // 页面加载完成调用是否是统一用户id
      @action
      getUserId(){
          return BLKSRNFetch(APIConfig.JUDGE_API,{
              method:'GET',
              data:{}
          }).then(res=>{
              return res
            //   this.userId = res
            //   console.log(res)
          })
      }

    //下拉刷新
    @action
    _handleRefresh(data) {
        SRNNative.Loading.show()
        BLKSRNFetch(APIConfig.SEARCH_API, {
            method: 'POST',
            json: {
                modelCode: data.carModelId,
                modelName: data.carModelName,
                exteriorColor:data.exteriorColorId,
                interiorColor: data.interiorColorId,
                storeNo: data.orgId,
                page: 1,
                pageSize: 20,
            }
        }).then((res) => {
            console.log(res, "查询结果");
            console.log(res.items.length, "查询结果");
            if (res.items.length > 0) {
                if (res.currentIndex >= res.totalPage) {
                    this.IsLastPage = true
                }
                console.log(res.items)
                this.pageInfo.page += 1
                this.resultList = res.items
            }
            SRNNative.Loading.hide()

            this.refreshing = false
            this.isSEARCH_API = true
        }).catch((error) => {
            SRNNative.Loading.hide()
            this.isSEARCH_API = true
            console.log(error);
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            }).then(() => {
                NavHelper.pop()
            });
        })
    }

    // 查询结果
    @action
    getSearchResult(data) {
        SRNNative.Loading.show()
        BLKSRNFetch(APIConfig.SEARCH_API, {
            method: 'POST',
            data: {
                modelCode: data.carModelId,
                carModelName: data.carModelName,
                exteriorColor: data.exteriorColorId,
                interiorColor: data.interiorColorId,
                storeNo: data.orgId,
                page: this.pageInfo.page,
                pageSize: 20,
            }
        }).then((res) => {
            this.isSEARCH_API = true
            console.log(res, "查询结果");
            if (res.items.length > 0) {
                if (res.currentIndex >= res.totalPage) {
                    this.IsLastPage = true
                }
                this.pageInfo.page += 1
                this.resultList = this.resultList.concat(res.items)
            } else {
                SRNNative.Loading.hide()

                this.refreshing = false
            }
        }).catch((error) => {
            SRNNative.Loading.hide()
            this.isSEARCH_API = true
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            }).then(() => {
                NavHelper.pop()
            });
        })
    }

    // 获取内饰色 车顶色 列表
    @action
    getColorData() {
        BLKSRNFetch(APIConfig.CARMODEL_API, {
            method: 'GET',
            data: {
                carModelId: this.searchChoose.carModelId
            },
        }).then((res) => {
            this.carColorList = res.externalColor
            this.carInColorList = res.innerColor
            console.log(res, "返回结果");
        }).catch((error) => {
            console.log(error)
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            })
        })
    }
    
    // 获取经销商 列表
    @action
    getDelearData() {
        BLKSRNFetch(APIConfig.DELEAR_API, {
            method: 'GET',
            data: {
                carBrandId:this.searchChoose.carBrandId
            },
        }).then((res) => {
            console.log(res)
            this.dealerList = res
        }).catch((error) => {
            console.log(error)
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            })
        })
    }

    // 点击查询历史赋值查询条件
    @action
    historyChange(val) {
        for (const key in val) {
            this.searchChoose[key] = val[key]
        }
    }

    // 重置查询结果
    @action
    resetResult() {
        this.resultList = []
        this.pageInfo = {
            page: 1,
            pageSize: 20,
        }
        this.IsLastPage = false
    }

    // 车型改变 车身色 内饰色 经销商清空
    @action
    carChangeFocus(){
        this.carColorList = []
        this.carInColorList = []
        this.dealerList = []
    }

    // 重置查询条件
    @action
    resetSearch() {
        this.searchChoose = {
            carModelName: '必选',
            carModelId: '',
            exteriorColor: '请选择',
            exteriorColorId: '',
            interiorColor: '请选择',
            interiorColorId: '',
            dealer: "请选择",
            orgId: '',
        }
    }
}

export default InventorySharingStore;