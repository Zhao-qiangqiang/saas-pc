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
// 库存明细列表数据
class ListItemSkeleton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={stylesExample.container}>
                <View style={stylesExample.listItem}>
                    <View>
                        <Text style={stylesExample.carModel}></Text>
                        <Text style={stylesExample.textStyle}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.width45]}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.width45]}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.width60]}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.marginBottom16]}></Text>
                        <View style={stylesExample.tagView}>
                            <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                            <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                            <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                        </View>
                    </View>
                </View>
                <View style={[stylesExample.listItem,stylesExample.listItemLast]}>
                    <View>
                        <Text style={stylesExample.carModel}></Text>
                        <Text style={stylesExample.textStyle}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.width45]}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.width45]}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.width60]}></Text>
                        <Text style={[stylesExample.textStyle,stylesExample.marginBottom16]}></Text>
                        <View style={stylesExample.tagView}>
                            <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                            <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                            <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                        </View>
                    </View>
                </View>
               


            </View>
        );
    }
}
const stylesExample = StyleSheet.create({
    wrapper: {
        marginVertical: 10,
        paddingHorizontal: 16,
    },
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
    tagView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tag: {
        width: 54,
        height: 16,
        marginRight: 4,

    },
    carModel: {
        marginBottom: 16,
        height: 16,
        width:'80%',
        backgroundColor:Color.G6
    },
    textStyle:{
        marginBottom: 8,
        height: 12,
        width:'50%',
        backgroundColor:Color.G6
    },
    marginBottom16:{
        marginBottom:16,
    },
    width45:{
        width:'45%',
    },
    width60:{
        width:'60%',
    }

})

export default ListItemSkeleton;
