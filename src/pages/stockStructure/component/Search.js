import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    NativeModules,
    InteractionManager,
    Dimensions,
    
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
            keyWords: keyword || '搜索'
        }

        this.props.emitter.on('searchValue', data => {
            this.store = data.store
            this.index = data.currentIndex
        })
    }

    componentDidMount(){
        
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
                        this.store.valueSearch(value,this.index)

                    }}
                />
            </View>
        )
    }
}
