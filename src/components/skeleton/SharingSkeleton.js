import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    PixelRatio
} from 'react-native';
import { observer } from '@souche-f2e/srn-framework';
import { theme, Tag, Color, Grid } from '@souche-ui/srn-ui';
const SCREEN_WIDTH = Dimensions.get('window').width;
@observer
// 库存共享列表数据
class SharingSkeleton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sharingList:[
                {num:1},
                {num:2},
                {num:3},
                {num:4},
                {num:5},
            ]
        };
    }

    render() {
        const { sharingList } = this.state
        return (
            <View style={stylesExample.container}>
                { sharingList.map((item,idx) => 
                    <View style={[stylesExample.listItem,idx >= sharingList.length-1 ? stylesExample.listItemLast : '']}>
                        <View>
                            <Text style={stylesExample.carModel}></Text>
                            <Text style={stylesExample.textStyle}></Text>
                            <Text style={[stylesExample.carModel,stylesExample.width45]}></Text>
                        </View>
                    </View> 
                )
                }
            </View>
        );
    }
}
const stylesExample = StyleSheet.create({
    container: {
        backgroundColor: Color.White1,
        paddingLeft: 16,

    },
    listItem: {
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#DCDCDC',
        paddingVertical: 16,
    },
    listItemLast:{
        borderBottomColor: Color.White1,
    },
    carModel: {
        height: 16,
        width:'80%',
        backgroundColor:Color.G6
    },
    textStyle:{
        marginTop: 8,
        marginBottom: 16,
        height: 12,
        width:'70%',
        backgroundColor:Color.G6
    },
    marginBottom16:{
        marginBottom:16,
    },
    width45:{
        width:'45%',
    },

})

export default SharingSkeleton;
