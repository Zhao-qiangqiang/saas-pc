import {
    SRNStore,
    observable,
    action,
    SRNConfig,
} from '@souche-f2e/srn-framework';
import BLKSRNFetch from '../shared/utils/fetch'

import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';

//配置查询接口
const APIConfig = {
    //获取库存总览总数据
    GetStockCar: `${SRNConfig.pangolin}/pangolinEntrance/getStockCar.json`,
    //获取库存车列表数据
    GetStockAccountDet: `${SRNConfig.pangolin}/pangolinEntrance/getStockAccountDet.json`,
    //查询品牌车辆
    GetThrSeriesCatalogByOrg: `${SRNConfig.pangolin}/pangolinEntrance/getThrSeriesCatalogByOrg.json`,
    //查询库龄
    GetLibraryAgeLabel: `${SRNConfig.pangolin}/pangolinEntrance/getLibraryAgeLabel.json`,
    //查询资金来源
    GetFinancialSourceLabel: `${SRNConfig.pangolin}/pangolinEntrance/getFinancialSourceLabel.json`,
    //查询免息截止日期
    GetExInterestBearingDateLabel: `${SRNConfig.pangolin}/pangolinEntrance/getExInterestBearingDateLabel.json`,


};

class InventoryCarListStore extends SRNStore {
    constructor() {
        super();
    }
    @observable isGetStockCar = false
    @observable isGetStockAccountDet = false
    //查询品牌是否为一个，如果为一个，需要直接定位到具体品牌
    @observable carBrandList = []
    //筛选默认值
    @observable
    filterDefaultValue = {
        sortFiled: { label: '库龄最长', value: '4' },
        extra: {
            carTag: [{ label: '全部', value: 'all' }],
            libraryAge: [{ label: '全部', value: 'all' }],
            price: [{ label: '全部', value: 'all' }],
            interestholiday: [{ label: '全部', value: 'all' }]
        }
    }
    //是否正在查询
    @observable isSearching = false

    //是否刷新数据
    @observable isLoading = true
    //是否为最后一页
    @observable isLastPage = false
    //库龄排序
    @observable
    sortFiledList = [
        { label: '库龄最长', value: '4' },
        { label: '车龄最长', value: '1' },
        { label: '预计交车时间正序', value: '2' },
        { label: '免息截止期正序', value: '3' },
    ]
    //库存标签
    @observable
    carTagList = [
        { label: '全部', value: 'all', res: 'facInvCnt', num: 0, isSelect: false },
        { label: '在库', value: '1', res: 'facInvZkCnt', num: 0, isSelect: false },
        { label: '在途', value: '2', res: 'facInvZtCnt', num: 0, isSelect: false },
        { label: '订单锁定', value: '3', res: 'isLockCnt', num: 0, isSelect: false },
        { label: '超期库存', value: '4', res: 'overdueInventoryCnt', num: 0, isSelect: false },
        { label: '现金车', value: '5', res: 'cashCarCnt', num: 0, isSelect: false },
        { label: '融资车', value: '6', res: 'financialCarCnt', num: 0, isSelect: false },
        { label: '库存预警', value: '7', res: 'waring', num: 0, isSelect: false },
    ]
    @action
    carTagListChange(data) {
        this.carTagList = data
    }
    //库龄
    @observable
    libraryAgeList = [
        { label: '全部', value: 'all', },
        // { label: '1-50天', value: '1', },
        // { label: '60-90天', value: '2', },
        // { label: '81-120天', value: '3', },
        // { label: '121-180天', value: '4', },
        // { label: '180天以上', value: '5', },
    ]
    //资金来源
    @observable
    priceList = [
        { label: '全部', value: 'all', },
        // { label: '厂商金融', value: '1', },
        // { label: '广汽', value: '2', },
        // { label: '银行承兑', value: '3', },
        // { label: '自有资金', value: '4', },
    ]
    //免息截止日期
    @observable
    interestholidayList = [
        { label: '全部', value: 'all', },
        // { label: '30天后', value: '1', },
        // { label: '15天后', value: '2', },
        // { label: '7天后', value: '3', },
    ]

    @observable globalSearch = ''//模糊查询
    @observable tagValue = '' //库存标签选中状态

    //库存车明细查询条件
    @observable
    inventoryData = {
        globalSearch: '',//模糊查询
        sortFiled: '4',//库龄排序，默认 库龄最长
        modelCode: '',//车型code

        invStatusName: '',//在库，在途，
        isLock: '',//订单锁定 1
        overdueInventory: '',//超期库存 1
        financialStatus: '',//融资车，现金车
        invWarning: '',//库存预警1

        financialSource: '',//资金来源
        exInterestBearingDate: '',//免息截止日期

        carTypeCode: '',//车型id
        carSeriesFilter: '',//车系
        libraryAgeSeach: '',//库龄模糊查询
    }

    //库存标签查询数据
    @observable
    carListNo = {
        globalSearch: '',//模糊查询
        modelCode: '',

        financialSource: '',//资金来源
        exInterestBearingDate: '',//免息截止日期

        carTypeCode: '',
        carSeriesFilter: '',
        libraryAgeSeach: '',
    }
    //列表数据
    @observable
    inventorySource = []

    //分页信息
    @observable
    pageInfo = {
        page: 1,
        pageSize: 10,
        totalNumber: 0
    }

    @action
    pageInfoChange(data) {
        this.pageInfo = data
    }
    @action
    globalSearchChange(data) {
        this.globalSearch = data || ''
    }
    //查询条件改变
    @action
    inventoryDataChange(data) {
        this.inventoryData = data
    }
    //标签数据改变
    @action
    carListNoChange(data) {
        this.carListNo = data
    }

    //库存台账数据tab查询接口
    @action
    queryInventoryTab() {
        const data = {
            ...this.carListNo,
        }
        BLKSRNFetch(APIConfig.GetStockCar, {
            method: 'POST',
            json: {
                ...data,
                globalSearch: this.globalSearch
            }
        }).then((res) => {
            let inventoryTabArr1 = this.carTagList
            inventoryTabArr1.map(item => {
                for (let k in res) {
                    if (item.res == k) {
                        item.num = res[k]
                    }
                }
            })
            this.carTagList = inventoryTabArr1
            this.isGetStockCar = true
        }).catch((error) => {
            this.isGetStockCar = true
            console.log(error)
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            });
        });
    }

    //查询数据列表
    queryInventoryList() {
        this.isSearching = true
        SRNNative.Loading.show();
        const data = {
            ...this.inventoryData,
            ...this.pageInfo,
        }
        BLKSRNFetch(APIConfig.GetStockAccountDet, {
            method: 'POST',
            json: {
                ...data,
                globalSearch: this.globalSearch
            }
        }).then(res => {
            this.isSearching = false
            this.isLoading = false
            SRNNative.Loading.hide();
            res.items.map((item, index) => {
                item.key = index + 1
                item.carIndex = index + 1
                item.mianxiDate = (item.mianxiDate || '').replace(/-/g, '/')
                item.expectedDeliveryDate = (item.expectedDeliveryDate || '').replace(/-/g, '/')
                item.estimatedArriveDate = (item.estimatedArriveDate || '').replace(/-/g, '/')
            });
            //最后一页
            if (res.currentIndex >= res.totalPage) {
                this.isLastPage = true
            } else {
                this.isLastPage = false
            }
            this.pageInfo = {
                ...this.pageInfo,
                page: this.pageInfo.page + 1,
                totalNumber: res.totalNumber
            }
            this.inventorySource = this.inventorySource.concat(res.items)
            this.isGetStockAccountDet = true
        }).catch((error) => {
            this.isGetStockAccountDet = true
            console.log(error)
            this.isSearching = false
            this.isLoading = false
            SRNNative.Loading.hide();
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            })
        });
    }
    //库存车查询列表下拉刷新接口
    @action
    _refresh() {
        this.pageInfo.page  = 1
        this.isLoading = true
        this.inventorySource = []
        this.queryInventoryList()
    }
    //查询库龄标签
    GetLibraryAgeLabel() {
        return BLKSRNFetch(APIConfig.GetLibraryAgeLabel, {
            method: 'GET',
            data: {}
        }).then(res => {
            let list = []
            res.map((item, idx) => {
                let obj = {}
                if (idx == 0) {
                    obj.label = `${item.startDate}天以上`,
                    obj.value = item.libraryAge
                } else {
                    obj.label = `${item.startDate} - ${item.endDate}天`,
                    obj.value = item.libraryAge
                }
                list.unshift(obj)
            })
            this.libraryAgeList = [...this.libraryAgeList,...list]
            this.isGetStockCar = true
            return this.libraryAgeList
        }).catch(err => {
            this.isGetStockCar = true
            console.log(err)
        })
    }
    //资金来源
    GetFinancialSourceLabel(){
        BLKSRNFetch(APIConfig.GetFinancialSourceLabel, {
            method: 'GET',
            data: {}
        }).then(res => {
            let list = []
            list = res.map(item => (
                {
                    label:item.labelName,
                    value:item.labelCode
                }
            ))
            this.priceList = [...this.priceList,...list]
            this.isGetStockCar = true
        }).catch(err => {
            this.isGetStockCar = true
            console.log(err)
        })
    }
     //免息截止日期
     GetExInterestBearingDateLabel(){
        BLKSRNFetch(APIConfig.GetExInterestBearingDateLabel, {
            method: 'GET',
            data: {}
        }).then(res => {
            let list = []
            list = res.map(item => (
                {
                    label:item.labelName,
                    value:item.labelCode
                }
            ))
            this.interestholidayList = [...this.interestholidayList,...list]
            this.isGetStockCar = true
        }).catch(err => {
            this.isGetStockCar = true
            console.log(err)
        })
    }

    //根据品牌/车系查询车型数据
    @action
    GetThrSeriesCatalogByOrg(data) {
        return BLKSRNFetch(APIConfig.GetThrSeriesCatalogByOrg, {
            method: 'GET',
            data: data
        }).then(res => {
            let list = []
            if (data.type == '3') {
                list = res.map(item => (
                    {
                        code: item.modelCode,
                        name: item.modelName,
                    }
                ))
            }
            this.carBrandList = res || []
            return list

        }).catch((error) => {
            SRNNative.confirm({
                title: '提示',
                text: error.msg,
                rightButton: '确认'
            })
        });
    }

}



export default InventoryCarListStore;