import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import {
    Color,
    FontSize,
    Icon
} from '@souche-ui/srn-ui';
import SearchPage from './SearchPage';
 
const { width } = Dimensions.get('window');

export default class Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            searching: false
        };
    }

    render(){
        return (
            <View>
                <View style={styles.searchContainer}>
                    <TouchableWithoutFeedback onPress={()=>{this.setState({searching: true});}}>
                        <View style={[styles.searchBox, {justifyContent: 'flex-start', alignItems: 'center',paddingLeft:16}]}>
                            <Icon type="search" size="md"/>
                            <View style={{width: 4}}/>
                            <Text style={{fontSize: FontSize.P2, color: Color.B3}}>{this.props.placeholder}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <SearchPage
                    focusPlaceholder = {this.props.focusPlaceholder || this.props.placeholder || ''}    // focus 状态下的占位符，默认 placeholder
                    searchHistory = {this.props.searchHistory || []}                                    // 搜索历史
                    clearHistory = {this.props.clearHistory}                                            // 清空历史方法
                    searchRecommend = {this.props.searchRecommend || []}                                // ddw
                    matchKeywords = {this.props.matchKeywords || []}                                    // 匹配关键词的候选词
                    groups = {this.props.groups || []}                                                  // 拓展型的候选组
                    selectedGroup = {this.props.selectedGroup || ''}                                    // 拓展型选中的组
                    onSearch = {this.props.onSearch}                                                    // 触发搜索操作的回调
                    onGroupChange = {this.props.onGroupChange}                                          // 拓展型组变化的回调
                    onValueChange = {this.props.onValueChange}                                          // 输入框值变化的回调
                    onCancelPress = {this.onCancelPress.bind(this)}                                     // 点击取消的回调
                    visible={this.state.searching}
                />
            </View>
        );
    }
    onCancelPress(){
        this.setState({searching: false});
    }
}

Search.propTypes = {
    placeholder: PropTypes.string,
    focusPlaceholder: PropTypes.string,
    searchHistory: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element,
    ]),
    clearHistory: PropTypes.func,
    searchRecommend: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element,
    ]),
    matchKeywords: PropTypes.array,
    groups: PropTypes.array,
    selectedGroup: PropTypes.string,
    onSearch: PropTypes.func,
    onGroupChange: PropTypes.func,
    onValueChange: PropTypes.func,
};

const styles = StyleSheet.create({
        searchContainer: {
            height: 44,
            flexDirection: 'row',
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: 'center',
            alignItems: 'center',
            width: width* 0.76 
        },
        searchBox: {
            height: 30,
            flex: 1,
            flexDirection: 'row',
            borderRadius: 15,
            backgroundColor: '#EAEAEA',
        }
});