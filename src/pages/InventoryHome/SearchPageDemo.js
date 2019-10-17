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

import InventoryKanBanInputResult from '../InventoryKanBan/component/inputResult'

@observer
class SearchPageExample extends React.Component {
    static navigation = {
        hidden: true
    };
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            searchHistory: [],
        };
        this.searchAction = this.searchAction.bind(this)
        this.clearHistory = this.clearHistory.bind(this)
        this.serarchHistoryPush = this.serarchHistoryPush.bind(this)
        this.sectionItem = this.sectionItem.bind(this)

        this.props.emitter.on('searchValue', data => {
            this.store = data.store
            this.tagIndex = data.tagIndex
        })
    }
    componentDidMount() {
        if (AsyncStorage.getItem('data')) {
            AsyncStorage.getItem('data').then(val => {
                this.setState({
                    searchHistory: JSON.parse(val) || []
                })
            })
        }

    }
    //搜索点击操作
    searchAction(val) {
        let value = ('' + val).trim()
        this.setState({
            keyWords: value
        })
        if (value == '') {
            SRNNative.toast({ text: `请输入数字、汉字、英文` })
            return
        }
        this.store.getSearchValue(value)
        this.store.changeTopSow(false)
        if(this.tagIndex == 1){
            NavHelper.push(InventoryKanBanInputResult, { store: this.store })
        }else{
            NavHelper.pop()
            // this.store.changeTabList()
        }
        
        this.serarchHistoryPush(value)
    }

    //添加搜索历史
    serarchHistoryPush(value) {
        let array = []
        array.push(value)
        const arr = array.concat(this.state.searchHistory)
        this.setState({
            searchHistory: arr
        })
        AsyncStorage.setItem('data', JSON.stringify(arr))

    }

    //清除搜索历史
    clearHistory() {
        this.setState({ searchHistory: [] })
        AsyncStorage.removeItem("data")
    }

    //获取历史信息
    sectionItem() {
        const { searchHistory } = this.state
        const deleteIcon =
            <TouchableWithoutFeedback onPress={this.clearHistory}>
                <Image style={{ width: 20, height: 20 }} source={{ uri: 'https://assets.souche.com/assets/sccimg/common/common_button_deletehistory_m_3x.png' }} />
            </TouchableWithoutFeedback>;
          
        let arrs = new Set(searchHistory)
        let searchHistoryRet = [...arrs].slice(0,5)
        let arr = searchHistoryRet.length > 0 ?
            [{ title: '搜索历史', icon: deleteIcon, items: [...searchHistoryRet] }] :
            [{ title: '搜索历史', items: [...searchHistoryRet] }]

        return arr
    }
    render() {
        const section = this.sectionItem()
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' ? <View style={styles.pageNavigatorBar} /> : null}
                <Search
                    placeholder={'搜索车系/车型/外观色'}
                    section={section} 
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
export default SearchPageExample
