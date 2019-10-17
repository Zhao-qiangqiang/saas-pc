import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import SRNNative from '@souche-f2e/srn-native';
import { observer } from '@souche-f2e/srn-framework';
import stylesExample from './style'

@observer
class CarInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.check = this.check.bind(this)

    }

    check(orderUrl) {
        if(orderUrl){
            SRNNative.open(orderUrl)
        }
        // singleunit://open/reactnative?module=RNSRPOrder&props=%7B%22route%22%3A%22%2FDetailOrder%22%2C%22orderCode%22%3A%22825251990590%22%7D
    }

    render() {
        const { detailListInfo } = this.props
        const purPrice = ((detailListInfo.purPrice - 0 )/10000 || 0 ).toFixed(2).replace(/(\d+?)(?=(\d{3})+(\.|$))/g,'$1,')
        return (
            <View >
                <View style={stylesExample.InfoStyle}>
                    <Text style={stylesExample.infoTitle}>车辆信息</Text>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>车龄</Text>
                        <Text style={stylesExample.infoViewText}>{(detailListInfo.carAge === '' ||  detailListInfo.carAge === undefined) ? '-':`${ detailListInfo.carAge}天`}</Text>
                    </View>
                    <View style={stylesExample.infoView}>
                        <Text style={stylesExample.infoViewTitle}>质损日期</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.carMassLossDate || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView}>
                        <Text style={stylesExample.infoViewTitle}>出厂日期</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.outFactoryDate || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView}>
                        <Text style={stylesExample.infoViewTitle}>发动机号</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.engineNo || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView}>
                        <Text style={stylesExample.infoViewTitle}>合格证号</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.qualifiedCardNo || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView}>
                        <Text style={stylesExample.infoViewTitle}>增配信息</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.ZPStr || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView}>
                        <Text style={stylesExample.infoViewTitle}>前装信息</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.QZStr || '-'}</Text>
                    </View>
                </View>
                <View style={stylesExample.InfoStyle}>
                    <Text style={stylesExample.infoTitle}>库存信息</Text>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>入库日期</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.recDate || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>出库日期</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.relDate || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>存放位置</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.warehouseName}-{ detailListInfo.locationName}</Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>钥匙号</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.carKeyNo || '-'}</Text>
                    </View>
                </View>
                <View style={[stylesExample.InfoStyle, !detailListInfo.orderLink ? stylesExample.lastStyle : '']}>
                    <Text style={stylesExample.infoTitle}>采购信息</Text>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>供应商</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.supplierName || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>采购价</Text>
                        <Text style={stylesExample.infoViewText}>
                            { detailListInfo.purPrice ? `${ purPrice}万`:`-`}
                        </Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>税率</Text>
                        <Text style={stylesExample.infoViewText}>
                            {detailListInfo.taxRate*100 ? `${detailListInfo.taxRate*100}%` : '-'}
                        </Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>资金来源</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.financialSource || '-'}{' '}{' '}
                            {/* 免息期大于15天 展示剩余，免息期0-15天 ，剩余但为红色，免息期小于0天，展示超期 */}
                            { detailListInfo.financialSource ?
                            <Text>
                                { detailListInfo.interestFreeDays > 15 ? <Text style={stylesExample.freeDate}>(免息期剩余{detailListInfo.interestFreeDays}天)</Text> : null}
                                { (detailListInfo.interestFreeDays >0 && detailListInfo.interestFreeDays <= 15) || detailListInfo.interestFreeDays ==='0' ? <Text style={stylesExample.overDate}>(免息期剩余{detailListInfo.interestFreeDays}天)</Text> : null}
                                {/* { !detailListInfo.interestFreeDays && detailListInfo.interestFreeDays !='0' ? <Text style={stylesExample.overDate}>(免息期剩余{`-`}天)</Text> : null} */}
                                { detailListInfo.interestFreeDays < 0 ? <Text style={stylesExample.overDate}>(免息超期{Math.abs(detailListInfo.interestFreeDays)}天)</Text> : null}
                            </Text>: null

                            }
                        </Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>采购单号</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.poNo || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>采购日期</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.poDate || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView} >
                        <Text style={stylesExample.infoViewTitle}>付款日期</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.payDate || '-'}</Text>
                    </View>
                    <View style={stylesExample.infoView}>
                        <Text style={stylesExample.infoViewTitle}>免息截止日期</Text>
                        <Text style={stylesExample.infoViewText}>{ detailListInfo.exInterestBearingDate || '-'}</Text>
                    </View>
                </View>
                { detailListInfo.lockOrderNo && detailListInfo.orderLink ? 
                    <View style={[stylesExample.InfoStyle, stylesExample.lastStyle]}>
                        <View style={stylesExample.orderInfo}>
                            <View style={[stylesExample.orderTitle]}>
                                <Text style={stylesExample.orderTitleText}>订单信息</Text>
                            </View>
                            <View style={stylesExample.checkMore}>
                                <TouchableOpacity onPress={this.check.bind(this,detailListInfo.orderLink)}>
                                    <View style={stylesExample.copy}>
                                        <Text style={stylesExample.copyText}>查看</Text>
                                    </View>
                                </TouchableOpacity> 
                            </View>
                        </View>
                        <View style={stylesExample.infoView} >
                            <Text style={stylesExample.infoViewTitle}>预计交车日期</Text>
                            <Text style={stylesExample.infoViewText}>{ detailListInfo.expectedDeliveryDate || '-'}</Text>
                        </View>
                    </View> : null
                }
            </View>
        );
    }
}


export default CarInfo;
