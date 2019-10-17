import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    NativeModules,
    InteractionManager,
    Dimensions
} from 'react-native'
import NavHelper from '@souche-f2e/srn-navigator'
import { observer } from '@souche-f2e/srn-framework'

import Search from '../../../shared/components/Search'
import stockStore from '../../../stores/stockStore'
@observer
export default class SearchPart extends React.Component {
    constructor(props) {
        super(props)
        const { keyword = '' } = props
        this.state = {
            keyWords: keyword || '搜索'
        }

        this.props.emitter.on('store', data => {
            this.store = data.msg
        })
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Search
                    placeholder={this.state.keyWords || '搜索'}
                    focusPlaceholder={this.state.keyWords || '搜索'}
                    onSearch={val => {
                        let value = ('' + val).trim()
                        this.setState({
                            keyWords: value
                        })
                        NavHelper.push('/stockCarListIteration', {
                            value: value,
                            tagValue: this.store.tagValue,
                            carInfo:this.store.carInfo
                        })
                        // if ((this.store || '').tabsData == 1) {
                        //     NavHelper.push('/stockCarList', {
                        //         tabs: 1,
                        //         value: value,
                        //         tagValue: this.store.tagValue
                        //     })
                        // } else if ((this.store || '').tabsData === 0) {
                        //     NavHelper.push('/stockCarList', {
                        //         tabs: 0,
                        //         value: value,
                        //         tagValue: this.store.tagValue
                        //     })
                        // } else {
                        //     NavHelper.push('/stockCarList', {
                        //         tabs: 2,
                        //         value: value,
                        //         tagValue: this.store.tagValue
                        //     })
                        // }
                    }}
                />
            </View>
        )
    }
}
