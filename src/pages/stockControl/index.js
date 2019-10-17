import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    InteractionManager
} from 'react-native';
import NavHelper from '@souche-f2e/srn-navigator';
import SRNNative from '@souche-f2e/srn-native';
import { SRNPage, observer, LifeCircle, SRNConfig } from '@souche-f2e/srn-framework';
import { Search, Color, Grid } from '@souche-ui/srn-ui';
//引入页面关联的store
import stockStore from '../../stores/stockStore';
const SCREEN_WIDTH = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
class StockControl extends React.Component {
    constructor() {
        super();
        this.state = {
            stockList: {
                facInvCnt: '', //全部
                facInvZkcnt: '', //在库
                facInvZtcnt: '', //在途
                isLockCnt: '', //订单锁定
                financialCarCnt: '', //金融车
                cashCarCnt: '', //现金车
                overdueInventoryCnt: '', //超期库龄车
            },
        };
        //实例化页面的store
        this.store = new stockStore();
    }
    //组件即将挂载的生命周期
    componentWillMount() {
       
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const {  carInfo } = this.props
            //说明是从库存结构跳转过来的,接收品牌车系
            if(carInfo){
                const { carListNo } = this.store
                this.store.carListNoChange({...carListNo, ...carInfo})
                this.store.carInfoChange(carInfo)

            }
            
            this.getList();
        })
       
    }
    //列表数据
    getList() {
        let stockList = {};
        this.store.getStockList(this.store.carListNo).then(res => {
            stockList = {
                facInvCnt: res.facInvCnt || 0, //全部
                facInvZkcnt: res.facInvZkCnt || 0, //在库
                facInvZtcnt: res.facInvZtCnt || 0, //在途
                isLockCnt: res.isLockCnt || 0, //订单锁定
                financialCarCnt: res.financialCarCnt || 0, //金融车
                cashCarCnt: res.cashCarCnt || 0, //现金车
                overdueInventoryCnt: res.overdueInventoryCnt || 0 //超期库龄车
            };
            this.setState({
                stockList: stockList
            });
        });
    }
    //跳转库存车
    carList = (type,code, e) => {
        SRNNative.bury(code, {
            // shopCode: this.props.shopCode,
            // salerId: this.props.salerId
        });

        this.store.changeTags(type);
        // NavHelper.push('/stockCarList', { tagValue: type });
        //目前跳到库存二次迭代页面
        NavHelper.push('/InventoryCarList', { tagValue: type, carInfo:this.store.carInfo});
    }
    //跳转库存结构
    onStockStructure() {
        SRNNative.bury('NCI-Tools-InventoryStructure', {});
        NavHelper.push('/stockStructure');
    }
    //跳转库存共享查询
    onInventorySharing() {
        NavHelper.push('/InventorySharing');
    }
    render() {
        const { stockList } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.wrapData}>
                    <Text style={styles.title}>库存总览</Text>
                    <Grid
                        cols={3}
                        width={SCREEN_WIDTH - 32}
                        style={{ marginTop: 36 }}
                        rowGap={24}>
                        <TouchableOpacity
                            onPress={this.carList.bind(this, 'facInvCnt','NCI-StockOverview-All')}>
                            <View style={styles.stockDataWrap}>
                                <Text style={styles.stockData}>
                                    {stockList.facInvCnt}
                                </Text>
                                <Text style={styles.stockTiele}>全部</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.carList.bind(this, 'facInvZkCnt','NCI-StockOverview-InStock')}>
                            <View style={styles.stockDataWrap}>
                                <Text style={styles.stockData}>
                                    {stockList.facInvZkcnt}
                                </Text>
                                <Text style={styles.stockTiele}>在库</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.carList.bind(this, 'facInvZtCnt','NCI-StockOverview-InTransit')}>
                            <View style={styles.stockDataWrap}>
                                <Text style={styles.stockData}>
                                    {stockList.facInvZtcnt}
                                </Text>
                                <Text style={styles.stockTiele}>在途</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.carList.bind(this, 'isLockCnt','NCI-StockOverview-OrderLocking')}>
                            <View style={styles.stockDataWrap}>
                                <Text style={styles.stockData}>
                                    {stockList.isLockCnt}
                                </Text>
                                <Text style={styles.stockTiele}>订单锁定</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.carList.bind(
                                this,
                                'overdueInventoryCnt','NCI-StockOverview-Extendedstock'
                            )}>
                            <View style={styles.stockDataWrap}>
                                <Text style={styles.stockData}>
                                    {stockList.overdueInventoryCnt}
                                </Text>
                                <Text style={styles.stockTiele}>超期库存</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.carList.bind(
                                this,
                                'cashCarCnt','NCI-StockOverview-CashCar'
                            )}>
                            <View style={styles.stockDataWrap}>
                                <Text style={styles.stockData}>
                                    {stockList.cashCarCnt}
                                </Text>
                                <Text style={styles.stockTiele}>现金车</Text>
                            </View>
                        </TouchableOpacity>

                        {/* 新增数据 */}
                        <TouchableOpacity
                            onPress={this.carList.bind(
                                this,
                                'financialCarCnt','NCI-StockOverview-FinancingCar'
                            )}>
                            <View style={styles.stockDataWrap}>
                                <Text style={styles.stockData}>
                                    {stockList.financialCarCnt}
                                </Text>
                                <Text style={styles.stockTiele}>融资车</Text>
                            </View>
                        </TouchableOpacity>
                    </Grid>
                </View>
                <View style={styles.wrap}>
                    <Text onPress={this.onPressTitle} style={styles.title}>
                        库存分析工具
                    </Text>
                    <Grid
                        cols={3}
                        width={SCREEN_WIDTH - 32}
                        style={{ marginTop: 52 }}
                        rowGap={24}>
                        <TouchableOpacity onPress={this.onStockStructure}>
                            <View style={styles.stockDataWrap}>
                                <Image
                                    style={styles.stockImg}
                                    source={{
                                        uri:
                                            'https://assets.souche.com/assets/sccimg/chuanshanjia/stockStructure.png'
                                    }}
                                />
                                <Text style={styles.stockTiele}>库存结构</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onInventorySharing}>
                            <View style={styles.stockDataWrap}>
                                <Image
                                    style={styles.stockImg}
                                    source={{
                                        uri:
                                            'https://assets.souche.com/assets/sccimg/chuanshanjia/stockSearch.png'
                                    }}
                                />
                                <Text style={styles.stockTiele}>库存共享查询</Text>
                            </View>
                        </TouchableOpacity>
                    </Grid>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.G4
    },
    wrapData:{
        width: '100%',
        // height: 256,
        height: 300,
        padding: 16,
        backgroundColor: Color.White1,
        marginBottom: 16
    },
    wrap: {
        width: '100%',
        height: 214,
        padding: 16,
        backgroundColor: Color.White1,
        marginBottom: 16
    },
    title: {
        fontSize: 16,
        color: '#1A1D33',
        fontWeight: 'bold'
    },
    stockDataWrap: {
        alignItems: 'center'
    },
    stockData: {
        fontSize: 24,
        color: '#1A1D33',
        fontWeight: 'bold'
    },
    stockTiele: {
        fontSize: 13,
        color: '#8D8E99'
    },
    stockList: {
        marginTop: 55,
        marginLeft: 45,
        flex: 1,
        alignItems: 'center'
    },
    stockImg: {
        width: 26,
        height: 26,
        marginBottom: 16
    }
});
export default StockControl;
