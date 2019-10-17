import { SRNStore, observable, action, SRNConfig, computed } from '@souche-f2e/srn-framework';
import BLKSRNFetch from '../shared/utils/fetch';

import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';

//配置查询接口
const APIConfig = {
  //获取库存总览总数据
  GetStockCar: `${SRNConfig.pangolin}/pangolinEntrance/getStockCar.json`,
  //获取库存车明细数据
  GetStockAccountDet: `${SRNConfig.pangolin}/pangolinEntrance/getStockAccountDet.json`,
  //获取角色列表
  GetAuthRoles: `${SRNConfig.pangolin}/pangolinEntrance/getAuthRoles.json`
};

class stockStore extends SRNStore {
  @observable tabsData = 0; //tabs状态
  @observable dataSource = []; //车系列表
  @observable carTypeList = []; //车型列表
  @observable carDescList = []; //库存车明细列表
  @observable searchValue = ''; //搜索的value
  @observable carStock = {};
  @observable carStockList = {
    //库存车标签的车辆数量
    facInvCnt: '0', //全部
    facInvZkCnt: '0', //在库
    facInvZtCnt: '0', //在途
    isLockCnt: '0', //订单锁定
    financialCarCnt: '0', //金融车
    overdueInventoryCnt: '0' //超期库龄车
  };

  @observable stockList = {
    //库存车明细查询关键字
    page: 1,
    pageSize: 10,
    isLock: '',
    financialCar: '',
    overdueInventory: '',
    invStatusName: '',
    modelCar: '',
    modelCode: ''
  };
  @observable carSeriesData = {
    //车系查询关键字
    carSeriesName: '',
    page: 1,
    pageSize: 1000,
    modelCode: ''
  };
  @observable carTypeData = {
    //车型查询关键字
    carModelName: '',
    page: 1,
    pageSize: 10000,
    modelCode: ''
  };

  @action
  getStockList(stockDetail) {
    //库存台账查询
    return BLKSRNFetch(`${SRNConfig.pangolin}/pangolinEntrance/getStockCar.json`, {
      method: 'POST',
      json: stockDetail
    })
      .then(res => {
        return res;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
      });
  }

  @action
  changeTagCode(value) {
    //明细库存台账筛选的code
    this.carListNo.modelCode = value;
  }
  @action
  changeTagCar(value) {
    //明细库存台账筛选的code
    this.carListNo.modelCar = value;
  }

  @action
  changeModelCode(value) {
    //车系筛选的code
    this.carSeriesData.modelCode = value;
  }
  @action
  changeStock(value) {
    this.stockList.modelCode = value;
  }
  @action
  changeSearch(value) {
    this.searchValue = value;
  }
  @action
  changeCarStockList(res) {
    this.carStockList = {
      facInvCnt: res.facInvCnt || 0, //全部
      facInvZkcnt: res.facInvZkCnt || 0, //在库
      facInvZtcnt: res.facInvZtCnt || 0, //在途
      isLockCnt: res.isLockCnt || 0, //订单锁定
      financialCarCnt: res.financialCarCnt || 0, //金融车
      overdueInventoryCnt: res.overdueInventoryCnt || 0 //超期库龄车
    };
  }

  @action
  getCarDetailList(stockDetail) {
    //库存车明细查询
    return BLKSRNFetch(`${SRNConfig.pangolin}/pangolinEntrance/getStockAccountDet.json`, {
      method: 'POST',
      json: stockDetail
    })
      .then(res => {
        return res;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
      });
  }
  @action
  changeDetailData(data) {
    //改变明细的数据
    this.carDescList = data;
  }
  @action
  getCarSeriesList(carList) {
    //车系查询
    return BLKSRNFetch(`${SRNConfig.pangolin}/pangolinEntrance/getCarStockSeriesList`, {
      method: 'GET',
      data: carList
    })
      .then(res => {
        return res;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
      });
  }
  @action
  changeSeriesData(data) {
    //改变车系的数据
    this.dataSource = data;
  }
  @action
  getCarTypeList(carList) {
    //车型查询
    return BLKSRNFetch(`${SRNConfig.pangolin}/pangolinEntrance/getCarStockModelList`, {
      method: 'GET',
      data: carList
    })
      .then(res => {
        return res;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
      });
  }
  @action
  changeTypeData(data) {
    //改变车型的数据
    this.carTypeList = data;
  }
  @action
  increasePage() {
    //明细上拉页数增加
    this.stockList.page = this.stockList.page + 1;
  }
  @action
  initialPage() {
    //明细下拉重置页数
    this.stockList.page = 1;
  }
  @action
  changePage(value) {
    //明细下拉重置页数
    this.stockList.page = value;
  }
  @action
  changeCarSeries(value) {
    //车系查询查询关键字
    this.carSeriesData.carSeriesName = value;
  }
  @action
  changeCarType(value) {
    //车型查询查询关键字
    this.carTypeData.carModelName = value;
  }
  @action
  changeCarTypCode(value) {
    //车型查询查询code

    this.carTypeData.modelCode = value;
  }

  @action
  changeModel(value) {
    this.stockList.modelCar = value;
  }
  @action
  wholeQuery() {
    //全部tag查询数据重置
    this.stockList.isLock = '';
    this.stockList.financialCar = '';
    this.stockList.overdueInventory = '';
    this.stockList.invStatusName = '';
  }
  @action
  stockQuery() {
    //在库tag查询数据重置
    this.stockList.isLock = '';
    this.stockList.financialCar = '';
    this.stockList.overdueInventory = '';
    this.stockList.invStatusName = '在库';
  }
  @action
  passQuery() {
    //在途tag查询数据重置
    this.stockList.isLock = '';
    this.stockList.financialCar = '';
    this.stockList.overdueInventory = '';
    this.stockList.invStatusName = '在途';
  }
  @action
  overQuery() {
    //超期库存tag查询数据重置
    this.stockList.isLock = '';
    this.stockList.financialCar = '';
    this.stockList.overdueInventory = '超期';
    this.stockList.invStatusName = '';
  }
  @action
  isLockQuery() {
    //已锁车tag查询数据重置
    this.stockList.isLock = '1';
    this.stockList.financialCar = '';
    this.stockList.overdueInventory = '';
    this.stockList.invStatusName = '';
  }
  @action
  financialQuery() {
    //金融车tag查询数据重置
    this.stockList.isLock = '';
    this.stockList.financialCar = '金融';
    this.stockList.overdueInventory = '';
    this.stockList.invStatusName = '';
  }

  @action selectCarModel(dataArr) {
    if (Array.isArray(dataArr)) {
      this.carModelData = [...dataArr];
    }
  }

  @computed get carModelName() {
    // 所有级拼起来的name
    /* const carModelData = this.carModelData.reduce((carModelName, item) => {
            carModelName += item.name ? `${item.name} ` : '';
            return carModelName;
        }, ''); */
    // 只取最后一级的name
    const len = this.carModelData.length;
    const carModelData = this.carModelData || [];
    const carModelName = carModelData[len - 1] ? carModelData[len - 1].name : '';
    return carModelName;
  }

  //库存车二次迭代
  //库存台账参数
  @observable keyWords = ''; //搜索关键字
  @observable carListNo = {
    modelCar: '',
    modelCode: '',

    globalSearch: '', //模糊查询
    carBrandFilter: '',
    carSeriesFilter: '',
    libraryAgeSeach: '',
    carTypeCode: '',
    modelCode: ''
  };
  //库存车明细查询条件
  @observable inventoryData = {
    globalSearch: '', //模糊查询
    libraryAgeSeach: '', //库龄模糊查询
    isLock: '', //订单锁定  已锁定1 ,未选择 ''
    financialCar: '', //金融
    overdueInventory: '', //超期库龄车
    invStatusName: '', //在库或者在途
    carBrandFilter: '', //品牌
    carSeriesFilter: '', //车系
    modelCode: '', //车型code
    sortFiled: '4' //库龄排序，默认 库龄最长
  };
  //库存车tag标签配置
  @observable inventoryTabArr = [
    { reqName: '', reqCode: '', label: '全部', value: 'facInvCnt', num: 0 },
    { reqName: '在库', reqCode: 'invStatusName', label: '在库', value: 'facInvZkCnt', num: 0 },
    { reqName: '在途', reqCode: 'invStatusName', label: '在途', value: 'facInvZtCnt', num: 0 },
    { reqName: '1', reqCode: 'isLock', label: '订单锁定', value: 'isLockCnt', num: 0 },
    {
      reqName: '超期',
      reqCode: 'overdueInventory',
      label: '超期库存',
      value: 'overdueInventoryCnt',
      num: 0
    },
    { reqName: '金融', reqCode: 'financialCar', label: '金融车', value: 'financialCarCnt', num: 0 }
  ];
  //库龄车默认 库龄最长
  @observable sortFiledDefault = {
    label: '库龄最长',
    value: '4'
  };
  //库龄初始数据 车龄最长先隐藏掉
  @observable sortFiledList = [
    { label: '库龄最长', value: '4' },
    // { label:'车龄最长', value:'1' },
    { label: '预计交车时间最近', value: '2' },
    { label: '免息截止期最近', value: '3' }
  ];
  @observable inventoryTabRet = {
    //库存台tag账存储数据
    facInvCnt: 0, //全部
    facInvZkCnt: 0, //在库
    facInvZtCnt: 0, //在途
    isLockCnt: 0, //订单锁定
    financialCarCnt: 0, //金融车
    overdueInventoryCnt: 0 //超期库龄车
  };
  @observable inventorySource = []; //库存车列表
  @observable isPull = true; //是否下拉加载
  @observable isPush = true; //是否上拉刷新
  @observable isRefresh = false; //是否上拉刷新
  @observable tagValue = ''; //选中的Tag标签
  //库存结构带过来的信息
  @observable carInfo = {
    carTypeCode: '',
    carSeriesFilter: '',
    libraryAgeSeach: ''
  };

  @observable pageInfo = {
    //分页信息
    page: 0,
    pageSize: 10,
    totalNumber: 0
  };
  @action carInfoChange(data) {
    //储存库存接口传过来的信息
    this.carInfo = data;
  }
  //搜索关键字改变
  @action keyWordsChange(value) {
    this.keyWords = value;
  }
  //是否加载数据
  @action changeIsLoading(value) {
    this.isPull = value;
    this.isPush = value;
  }
  //库存台账改变
  @action carListNoChange(data) {
    this.carListNo = data;
  }

  //改变tag标签的value
  @action changeTags(value) {
    this.tagValue = value;
  }
  //筛选条件改变
  @action inventoryDataChange(obj) {
    this.inventoryData = obj;
  }
  //库龄选择
  @action onSortFiledDefaultChange(value) {
    this.sortFiledDefault = value;
    this.inventoryData.sortFiled = value.value;
  }
  //库存台账数据tab查询接口
  @action queryInventoryTab(data) {
    BLKSRNFetch(APIConfig.GetStockCar, {
      method: 'POST',
      json: data
    })
      .then(res => {
        let inventoryTabArr1 = this.inventoryTabArr;
        inventoryTabArr1.map(item => {
          for (let k in res) {
            if (item.value == k) {
              item.num = res[k];
            }
          }
        });

        this.inventoryTabRet = res;
        this.inventoryTabArr = inventoryTabArr1;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
      });
  }

  //库存车查询列表下拉刷新接口
  @action queryInventoryListPull(data, pageInfo) {
    this.isRefresh = true;
    this.inventorySource = [];
    SRNNative.Loading.show();
    BLKSRNFetch(APIConfig.GetStockAccountDet, {
      method: 'POST',
      json: { ...data, ...pageInfo }
    })
      .then(res => {
        SRNNative.Loading.hide();
        res.items.forEach((item, index) => {
          item.key = index + 1;
          item.carIndex = index + 1;
          item.mianxiDate = (item.mianxiDate || '').replace(/-/g, '/');
          item.expectedDeliveryDate = (item.expectedDeliveryDate || '').replace(/-/g, '/');
          item.libraryAge = isNaN(parseInt(item.libraryAge)) ? '-' : parseInt(item.libraryAge);
        });
        pageInfo.totalNumber = res.totalNumber;
        this.inventorySource = res.items || [];
        this.pageInfo = pageInfo;
        //禁止刷新
        this.isPull = false;

        this.isRefresh = false;
      })
      .catch(error => {
        SRNNative.Loading.hide();
        this.isRefresh = false;
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
      });
  }
  //库存车查询列表上拉加载接口
  @action queryInventoryListPush(data, pageInfo) {
    this.isRefresh = true;
    SRNNative.Loading.show();
    BLKSRNFetch(APIConfig.GetStockAccountDet, {
      method: 'POST',
      json: { ...data, ...pageInfo }
    })
      .then(res => {
        let list = this.inventorySource;
        SRNNative.Loading.hide();
        res.items.forEach((item, index) => {
          item.key = list.length + index + 1;
          item.carIndex = list.length + index + 1;
          item.mianxiDate = (item.mianxiDate || '').replace(/-/g, '/');
          item.expectedDeliveryDate = (item.expectedDeliveryDate || '').replace(/-/g, '/');
          item.libraryAge = isNaN(parseInt(item.libraryAge)) ? '-' : parseInt(item.libraryAge);
        });
        pageInfo.totalNumber = res.totalNumber;
        this.inventorySource = [...list, ...res.items];
        this.pageInfo = pageInfo;

        this.isRefresh = false;
        //说明是最后一页,禁止上拉
        if (pageInfo.page >= res.totalPage) {
          this.isPush = false;
        }
      })
      .catch(error => {
        SRNNative.Loading.hide();
        this.isRefresh = false;
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
      });
  }
  //库存车查询列表上拉加载接口
  @action getAuthRoles(data) {
    SRNNative.Loading.show();
    return BLKSRNFetch(APIConfig.GetAuthRoles, {
      method: 'POST',
      json: data
    })
      .then(res => {
        SRNNative.Loading.hide();
        return res;
      })
      .catch(error => {
        SRNNative.Loading.hide();
        console.log(error);
      });
  }
}

export default stockStore;
