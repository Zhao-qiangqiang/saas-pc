/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-26 10:09:53
 * @LastEditTime: 2019-09-02 16:47:32
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';
import NavHelper from '@souche-f2e/srn-navigator';
import SRNNative from '@souche-f2e/srn-native';
//加载不同的导航条搜索
import SearchInNewPage from './SearchPageDemo';

import { SRNPage, observer, LifeCircle, SRNConfig } from '@souche-f2e/srn-framework';

import { Color, Grid, Icon, Search } from '@souche-ui/srn-ui';
import CarBrandSelect from '@souche-ui/RNCarBrandSelect';
// 引入公共组件
import { CarModelSelect } from '../../shared/components/CarModel';
import { CarListSearch } from '../../shared/components/SearchPage';
// 引入子组件
import StockControl from '../stockControl';
import InventoryKanBan from '../InventoryKanBan/index';
// 引入当前页面关联的 store
import inventoryKanBanStore from '../../stores/inventoryKanBanStore';
import stockStore from '../../stores/stockStore';
import inventoryHomeStore from '../../stores/inventoryHomeStore';
import carSelectModelStore from '../../stores/carSelectModelStore';
import InventoryKanBanSelectResult from '../InventoryKanBan/component/inputResult';
//配置查询接口
const APIConfig = {
  //车辆列表查询
  GetThrCarSeriesCatalogByOrg: `${
    SRNConfig.pangolin
  }/pangolinEntrance/getThrCarSeriesCatalogByOrg.json`
};
const SCREEN_WIDTH = Dimensions.get('window').width;
@observer
class InventoryHome extends SRNPage {
  static navigation = {
    title: {
      text: '加载中'
    },
    left: {
      showArrow: true
    },
    headerStyle: { borderBottomColor: '#FFFFFF' },
    right: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      isCLLB: false, //是否显示在售/在途车辆列表页面，
      isKCZL: false, //是否显示库存总览页面
      codeList: [
        {
          label: '库存台账',
          value: 'JITUANBAN-APP-jiugongge-NewCarInventory-InventoryAccount'
        },
        { label: '销售顾问库存看板', value: 'CAkanban' }
      ]
    };
    this.inventoryKanBanStore = new inventoryKanBanStore();
    this.stockStore = new stockStore();
    this.inventoryHomeStore = new inventoryHomeStore();
    this.carSelectModelStore = new carSelectModelStore();
    this.selectCarModel = this.selectCarModel.bind(this);
  }
  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      SRNNative.getAppData().then(res => {
        this.inventoryHomeStore.getAuthRoles({ token: res.userToken }).then(res => {
          console.log(res);
          if (res && Array.isArray(res)) {
            //根据返回的res进行判断
            let isCLLBList = res.find(item => item.code == 'CAkanban');
            let isKCZLList = res.find(
              item =>
                item.code == 'JITUANBAN-APP-jiugongge-NewCarInventory-InventoryAccount'
            );

            // let isCLLBList = true
            // let isKCZLList = false
            //展示库存总览
            if ((isKCZLList && isCLLBList) || (isKCZLList && !isCLLBList)) {
              this.setState({ isKCZL: true });
              this.setNavigation({
                title: {
                  component: ({ emitter, sceneProps }) => {
                    setTimeout(() => {
                      this.emitter.emit('store', {
                        store: this.stockStore,
                        tagFlag: 'home'
                      });
                    }, 0);
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          NavHelper.push(CarListSearch, {
                            emitter,
                            keyword: ''
                          });
                        }}
                      >
                        <View style={styles.searchHeaderInput}>
                          <Search.Indicator placeholder='搜索车系/车型' />
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  }
                },
                right: {}
              });
            } else if (!isKCZLList && isCLLBList) {
			  //展示车辆列表
			//从新车行情跳转带入车型id
			const { modelCode = '' } = this.props
			this.inventoryKanBanStore.linkModelCodeChange(modelCode)


              this.setState({ isCLLB: true });
              this.setNavigation({
                title: {
                  component: ({ emitter, sceneProps }) => {
                    const routerProps = _.get(
                      sceneProps,
                      'scene.route.ComponentInstance.props',
                      {}
                    );
                    const { value = '' } = routerProps;
                    setTimeout(() => {
                      this.emitter.emit('searchValue', {
                        store: this.inventoryKanBanStore,
                        tagIndex: 1
                      });
                    }, 0);
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          NavHelper.push(SearchInNewPage, {
                            emitter,
                            keyword: value
                          });
                        }}
                      >
                        <View style={styles.searchHeader}>
                          <Search.Indicator placeholder='搜索车系/车型/外观色' />
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  }
                },
                right: {
                  component: ({ emitter, sceneProps }) => {
                    return (
                      <View style={styles.searchHeaderRight}>
                        <View style={styles.searchHeaderRightSub}>
                          <Text style={styles.searchHeaderRightSubText}>筛选</Text>
                        </View>
                      </View>
                    );
                  },
                  onPress: (emitter, sceneProps) => {
                    emitter.emit('carSelectKanBan');
                    // NavHelper.push(CarModelSelect, {
                    //     level: 3,
                    //     emitter,
                    //     title: '车系/车型',
                    // });
                  }
                }
              });
            } else {
              //返回上一页
              SRNNative.toast({
                text: `您没有该权限`,
                icon: 'success'
              }).then(() => {
                NavHelper.pop();
              });
            }
          } else {
            SRNNative.toast({
              text: `您没有该权限`,
              icon: 'success'
            }).then(() => {
              NavHelper.pop();
            });
          }
        });
      });
    });
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //查询车型
      this.carSelectModelStore.GetThrSeriesCatalogByOrg({ type: 1, code: '' });
      this.emitter.on('carSelectKanBan', data => {
        var carBrand = new CarBrandSelect();
        const { carBrandList, carSelectList } = this.carSelectModelStore;
        if (carBrandList.length > 0) {
          NavHelper.push(carBrand.carSeries, {
            unlimitedBrand: 0,
            unlimitedSeries: 0,
            selectType: 2, //多个车型
            detailType: 1,
            items: carSelectList, //默认值
            brandApi: `${APIConfig.GetThrCarSeriesCatalogByOrg}?type=1&code=`,
            seriesApi: `${APIConfig.GetThrCarSeriesCatalogByOrg}?type=2`,
            modelApi: `${APIConfig.GetThrCarSeriesCatalogByOrg}?type=3`
          });
        } else {
          NavHelper.push(carBrand.carSeries, {
            unlimitedBrand: 0,
            unlimitedSeries: 0,
            selectType: 2, //多个车型
            detailType: 1,
            items: carSelectList, //默认值
            showBrand: carBrandList[0], //只有一个品牌的时候直接打开车系
            brandApi: `${APIConfig.GetThrCarSeriesCatalogByOrg}?type=1&code=`,
            seriesApi: `${APIConfig.GetThrCarSeriesCatalogByOrg}?type=2`,
            modelApi: `${APIConfig.GetThrCarSeriesCatalogByOrg}?type=3`
          });
        }

        carBrand.onSelect(data => {
          this.carSelectModelStore.carSelectListChange(data.items || []);

          let lavel = 2;
          data.items &&
            data.items[0].items &&
            data.items[0].items[0].items &&
            (lavel = 3);

          if (lavel == 2) {
            //如果是2级，选中之后查询车型具体列表，查询数据拿到所有车型 ，显示 已选择1个车型
            this.carSelectModelStore
              .GetThrSeriesCatalogByOrg({
                type: 3,
                code: data.items[0].items[0].code
              })
              .then(res => {
                if (res && res.length > 0) {
                  //说明查询到数据了, 赋值
                  let list = Object.keys(res || {})
                    .map(key => res[key].code)
                    .join(',');
                  this.selectCarModel(list);
                }
              });
          } else {
            //如果是3级，选中之后如果是一个，显示车型，多个显示多个车型
            let res = data.items[0].items[0].items;
            let list = Object.keys(res || {})
              .map(key => res[key].code)
              .join(',');

            this.selectCarModel(list);
          }
        });
      });
      // this.emitter.on('selectCarModel', data => { this.selectCarModel(data) })
    });
  }
  selectCarModel(list) {
    setTimeout(() => {
      this.inventoryKanBanStore.filterChange(list);
      NavHelper.push(InventoryKanBanSelectResult, {
        store: this.inventoryKanBanStore,
        isSearchResult: true
      });
    }, 0);

    // if (dataArr.length) {
    //     this.inventoryKanBanStore.filterChange(dataArr[dataArr.length - 1].modelCode)
    //     NavHelper.pop()
    //     NavHelper.push(InventoryKanBanSelectResult, { store: this.inventoryKanBanStore,isSearchResult:true })
    // }
  }
  render() {
    const { isKCZL, isCLLB } = this.state;
    return (
      <View style={styles.container}>
        {/* 有库存总览权限显示 */}
        {isKCZL ? <StockControl /> : null}
        {/* 只有车辆列表页时显示 */}
        {/* <InventoryKanBan store={this.inventoryKanBanStore} /> */}
        {isCLLB ? <InventoryKanBan store={this.inventoryKanBanStore} /> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White1
  },
  searchHeader: {
    width: '93%'
  },
  searchHeaderInput: {
    width: '92%',
    marginLeft: '6%'
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
    width: SCREEN_WIDTH * 0.9,
    padding: 10
  }
});
// 导出组件
export default InventoryHome;
