import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';
import { observer } from '@souche-f2e/srn-framework';
import {  theme,Tag,Color,Grid } from '@souche-ui/srn-ui';
const SCREEN_WIDTH = Dimensions.get('window').width;
@observer
// 顶部选择标签选择
class TagSkeleton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={stylesExample.container}>
                <Grid style={stylesExample.wrapper} width={SCREEN_WIDTH - 32} cols={4} columnGap={8} rowGap={10}>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                    <Tag style={stylesExample.tag} autoWidth={false}> </Tag>
                </Grid>
            </View>
        );
    }
}
const stylesExample = StyleSheet.create({
    wrapper: {
        marginVertical: 10,
        paddingHorizontal: 16,
    },
    container:{
        backgroundColor: Color.White1, 
    },
    tag:{
        height: 30,
    }

})

export default TagSkeleton;
