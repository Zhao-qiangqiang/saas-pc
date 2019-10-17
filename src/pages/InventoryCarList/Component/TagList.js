/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-16 13:36:57
 * @LastEditTime: 2019-08-16 13:40:26
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { observer } from '@souche-f2e/srn-framework';
import {  theme } from '@souche-ui/srn-ui';

@observer
class CarTag extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { data, carTagList } = this.props
        //是否选定在库
        const isfacInvZkCnt = carTagList.find(item =>item.res =='facInvZkCnt' && item.isSelect)
        //是否选定在途
        const isfacInvZtCnt = carTagList.find(item =>item.res =='facInvZtCnt' && item.isSelect)
        //是否超期
        const isoverdueInventoryCnt = carTagList.find(item =>item.res =='overdueInventoryCnt' && item.isSelect)
        //是否订单锁定
        const isisLockCnt = carTagList.find(item =>item.res =='isLockCnt' && item.isSelect)
        //是否融资车
        const isfinancialCarCnt = carTagList.find(item =>item.res =='financialCarCnt' && item.isSelect)
        return (
            <View>
                <View style={stylesExample.tagStyle}>
                    { data.overdueInventory ?
                        <View style={[stylesExample.tagView, stylesExample.overdueInventoryView]}>
                            <Text style={[stylesExample.tagText, stylesExample.overdueInventoryText]}>库龄{data.libraryAge }天</Text>
                        </View>: null
                    }
                    {!data.overdueInventory ?
                        <View style={stylesExample.tagView}>
                            <Text style={stylesExample.tagText}>库龄{data.libraryAge }天</Text>
                        </View>: null
                    }
                    {/* 车龄 */}
                    <View style={stylesExample.tagView}>
                        <Text style={stylesExample.tagText}>车龄{data.carAge }天</Text>
                    </View>
                    {/* 在库/在途 */}
                    {data.invStatusName && !isfacInvZkCnt && !isfacInvZtCnt ?
                         <View style={stylesExample.tagView}>
                            <Text style={stylesExample.tagText}>{data.invStatusName}</Text>
                        </View>:null
                    }
                    {/* 超期 */}
                    {data.overdueInventory && !isoverdueInventoryCnt ?
                        <View style={stylesExample.tagView}>
                        <Text style={stylesExample.tagText}>超期</Text>
                    </View>:null
                    }
                    {/* 订单锁定 */}
                    { data.isLock && !isisLockCnt ?
                        <View style={stylesExample.tagView}>
                        <Text style={stylesExample.tagText}>{data.isLock}</Text>
                    </View>:null
                    }
                    {/* 融资车 */}
                    {data.financialCar && !isfinancialCarCnt ?
                        <View style={stylesExample.tagView}>
                        <Text style={stylesExample.tagText}>{data.financialCar}</Text>
                    </View>:null
                    }
                </View>
            </View>
        );
    }
}
const stylesExample = StyleSheet.create({
    tagStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8
    },
    tagView: {
        height: 16,
        justifyContent: 'center',
        paddingHorizontal: 6,
        borderRadius: 2,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 2,
        marginVertical: 3,
    },
    tagText: {
        fontSize: 10,
        color: theme('color_text_body'),
        fontWeight: 'bold'
    },
    overdueInventoryView: {
        backgroundColor: '#FF571A1A',
    },
    overdueInventoryText: {
        color: theme('color_primary_text'),
    },

})

export default CarTag;
