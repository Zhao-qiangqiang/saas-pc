import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { observer } from '@souche-f2e/srn-framework';
import stylesExample from './style'

@observer
class CarTag extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { detailListInfo } = this.props

        return (
            <View>
                <View style={stylesExample.tagStyle}>
                    {/* 库龄标签 */}
                    {detailListInfo.invStatus == '在库' ?
                        <View style={[stylesExample.tagView,detailListInfo.overdueInventory ? stylesExample.overdueInventoryView:'']}>
                            <Text style={[stylesExample.tagText, detailListInfo.overdueInventory ? stylesExample.overdueInventoryText:'']}>库龄{detailListInfo.libraryAge}天</Text>
                        </View> : null
                    }
                    {/* 在库/在途 */}
                    {detailListInfo.invStatus ?
                        <View style={stylesExample.tagView}>
                            <Text style={stylesExample.tagText}>{detailListInfo.invStatus}</Text>
                        </View> : null
                    }
                    {detailListInfo.isLock ?
                        <View style={stylesExample.tagView}>
                            <Text style={stylesExample.tagText}>订单锁定</Text>
                        </View> : null
                    }
                    {detailListInfo.overdueInventory ?
                        <View style={stylesExample.tagView}>
                            <Text style={stylesExample.tagText}>超期</Text>
                        </View> : null
                    }
                    {detailListInfo.isFinancial === '1' ?
                        <View style={stylesExample.tagView}>
                            <Text style={stylesExample.tagText}>融资车</Text>
                        </View> : null
                    }
                </View>
            </View>
        );
    }
}


export default CarTag;
