import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    NativeModules,
    InteractionManager,
    Dimensions,
    AsyncStorage
} from 'react-native'
import NavHelper from '@souche-f2e/srn-navigator'
import { observer } from '@souche-f2e/srn-framework'

import Search from '../../../shared/components/Search'

@observer
export default class SearchPart extends React.Component {
    constructor(props) {
        super(props)
        const { keyword = '' ,onValue} = props
        this.state = {
            keyWords: keyword || '搜索车系/车型/外观色',
            selectedGroup: 'xc',
            searchHistory: [],
            list:[]
        }

        this.props.emitter.on('searchValue', data => {
            this.store = data.store
        })
    }

    componentDidMount(){
        if(AsyncStorage.getItem('data')){
            AsyncStorage.getItem('data').then(val=>{
               this.setState({
                   searchHistory:JSON.parse(val)
               })
           })
        }
        
    }

    serarchHistoryPush(value){
        let array = []
        array.push(value)
        const arr = array.concat(this.state.searchHistory)
        this.setState({
                searchHistory:arr
        })
        AsyncStorage.setItem('data',JSON.stringify(arr))
       
    }
  
    clearHistory(){
        this.setState({
            searchHistory: []
        })
        AsyncStorage.removeItem("data")
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Search
                    placeholder={this.state.keyWords || '搜索车系/车型/外观色'}
                    focusPlaceholder={this.state.keyWords || '搜索车系/车型/外观色'}
                    onSearch={val => {
                        let value = ('' + val).trim()
                        this.setState({
                            keyWords: value
                        })
                        this.store.getSearchValue(value)
                        this.serarchHistoryPush(value)
                        this.store.changeTopSow(false)
                        NavHelper.push("/InventoryKanBanInputResult",{store:this.store})
                    }}
                    searchHistory={this.state.searchHistory}
                    clearHistory={this.clearHistory.bind(this)}
                />
            </View>
        )
    }
}
