import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    NativeModules,
    InteractionManager,
    Dimensions
} from 'react-native';

import { observer } from '@souche-f2e/srn-framework';

import Search from '../../../shared/components/Search';

@observer
export default class SearchPart extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            keyWords: '' || '搜索'
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <View>
                <Search
                    placeholder={this.state.keyWords}
                    focusPlaceholder={'车型/客户姓名/电话/VIN码后四位'}
                    onSearch={(val) => {
                        console.log(val)
                        let value = ('' + val).trim()
                        this.setState({
                            keyWords: value || '搜索'
                        })
                        this.props.emitter.emit('setKeyWords', {
                            value
                        })
                    }}
                />
            </View>
        )
    }
}