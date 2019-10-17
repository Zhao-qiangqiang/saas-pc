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
@observer
export default class SearchPart extends React.Component {
    constructor(props) {
        super(props)
        const { keyword } = props
        this.state = {
            keyWords: keyword || '搜索'
        }

        this.props.emitter.on('store', data => {
            this.store = data.store

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
                        this.store.keyWordsChange(value)
                        //关键字查询tab
                        this.store.inventoryDataChange({
                            ...this.store.inventoryData,
                            globalSearch:value
                        })
                        this.store.carListNoChange({
                            ...this.store.carListNo,
                            globalSearch:value
                        })
                        this.store.inventoryDataChange(this.store.inventoryData)
                        this.store.queryInventoryTab(this.store.carListNo)
                        this.store.changeIsLoading(true)
                        //关键字查询列表
                        this.store.queryInventoryListPull(
                            this.store.inventoryData,
                            {
                                ...this.store.pageInfo,
                                page: 1
                            }
                        )

                    }}
                />
            </View>
        )
    }
}
