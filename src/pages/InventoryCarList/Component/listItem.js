import React from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { observer } from '@souche-f2e/srn-framework';
import NavHelper from '@souche-f2e/srn-navigator';
import SRNNative from '@souche-f2e/srn-native';
import StylesExample from './Styles'
import TagList from './TagList'
@observer
class ListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.onpressGo = this.onpressGo.bind(this)
    }
    onpressGo(item){
        SRNNative.bury('NCI-StockOverview-Listing-Details', {
            // shopCode: this.props.shopCode,
            // salerId: this.props.salerId
        });
        NavHelper.push('/InventoryCarDetail',{
            invId:item.invId || '',
            parentStore:this.props.store || ''
        })
    }
    render() {
        const { data ,carTagList} = this.props
        return (
            <View>
                { data.map((item, idx) => (
                    <View key={idx}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onpressGo.bind(this,item)}>
                        <View style={[StylesExample.viewContainer,
                        idx >= data.length - 1 ? StylesExample.lastViewContainer : '']}>
                            <Text style={StylesExample.carTitle} >{item.carModelName || '-'}</Text>
                            <Text style={StylesExample.carDec}>
                                外观{item.exteriorColor || '无'} | 
                                内饰{item.interiorColor || '无'}
                                {item.invStatusName == '在库'? 
                                    <Text> | {item.carMassLossStatusName ||'-'}</Text> : null
                                }
                            </Text>
                            <Text style={StylesExample.carDec}>VIN：{item.vin || '-'}</Text>
                            {item.invStatusName == '在库'?
                                <Text style={StylesExample.carDec}>存放位置：{item.storageLocation || '-'}</Text> : null
                            }
                            <Text style={StylesExample.carDec}>资金来源：{item.financialSource || '-'}
                            { item.financialSource ?
                            <Text>
                                {/* 免息期大于15天 展示剩余，免息期0-15天 ，剩余但为红色，免息期小于0天，展示超期 */}
                                { item.mianxiDays > 15 ? <Text style={StylesExample.freeDate}>(免息期剩余{item.mianxiDays}天)</Text> : null}
                                { (item.mianxiDays >0 && item.mianxiDays <= 15) || item.mianxiDays ==='0' ? <Text style={StylesExample.overDate}>(免息期剩余{item.mianxiDays}天)</Text> : null}
                                {/* { !item.mianxiDays && item.mianxiDays !='0' ? <Text style={StylesExample.overDate}>(免息期剩余{`-`}天)</Text> : null} */}
                                { item.mianxiDays < 0 ? <Text style={StylesExample.overDate}>(免息超期{Math.abs(item.mianxiDays)}天)</Text> : null}
                            </Text> : null
                            }
                            </Text>
                            { item.financialCar =='融资车' ? 
                                <Text style={StylesExample.carDec}>免息截止日期：{item.mianxiDate || '-'}</Text>:null
                            }
                            {item.isLock == '订单锁定' ? 
                                <Text style={StylesExample.carDec}>订单编号：{item.orderNo || '-'}</Text> : null
                            }
                            {item.isLock == '订单锁定' ? 
                                <Text style={StylesExample.carDec}>预计交车日期：{item.expectedDeliveryDate || '-'}</Text>: null
                            }
                            { item.invStatusName == '在途'?
                                <Text style={StylesExample.carDec}>预计到店日期：{item.estimatedArriveDate || '-'}</Text> : null
                            }
                            <View>
                                <TagList data={item} carTagList={carTagList} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    </View>
                ))
                }

            </View>
        );
    }
}


export default ListItem;
