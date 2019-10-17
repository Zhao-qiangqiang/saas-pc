import React from 'react';
import {
    StyleSheet, View, Image,
    TouchableWithoutFeedback, Platform, AsyncStorage
} from 'react-native';

import {
    Search,
    theme
} from '@souche-ui/srn-ui';
import NavHelper from '@souche-f2e/srn-navigator';
import { observer } from '@souche-f2e/srn-framework'
import SRNNative from '@souche-f2e/srn-native';


@observer
class CarListSearch extends React.Component {
    static navigation = {
        hidden: true
    };
    constructor(props) {
        super(props);
        const { keyWords } = props
        this.state = {
            keyWords: keyWords || '',
        };
        this.searchAction = this.searchAction.bind(this)

    }
    
    componentDidMount() {
        this.props.emitter.on('store', data => {
            this.store = data.store
            this.tagFlag = data.tagFlag
        })
    }
    
    //搜索点击操作
    searchAction(val) {
        // debugger
        let value = ('' + val).trim()
        this.setState({
            keyWords: value
        })
        if (value == '' && this.tagFlag == 'home') {
            SRNNative.toast({ text: `请输入数字、汉字、英文` })
            return
        }

        if(this.tagFlag == 'home'){
            // 从home跳转过来的，然后跳转到页面
            NavHelper.pop()
            NavHelper.push('/InventoryCarList', {
                globalSearch: value,
                tagValue: '',
            })
        }else{
            //调用查询接口
            this.store.globalSearchChange(value)
            this.store.pageInfoChange({
                ...this.store.pageInfo,
                page:1
            })
            this.store._refresh()
            this.store.queryInventoryTab()
            NavHelper.pop()

        }
    }


    render() {
        const { keyWords } = this.state

        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' ? <View style={styles.pageNavigatorBar} /> : null}
                <Search
                    placeholder={keyWords || '搜索车系/车型'}
                    onCancelPress={() => { NavHelper.pop()}}
                    throttleDelay={1000}
                    onSearch={this.searchAction}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme('color_white')
    },
    pageNavigatorBar: {
        height: 20,
        backgroundColor: theme('color_white')
    }
});
export default CarListSearch
