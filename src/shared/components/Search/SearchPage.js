import React from 'react';
import {
    View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Platform, Modal, Image,StyleSheet, Animated, Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

import {
    Color,
    FontSize,
    Icon,
    popover
} from '@souche-ui/srn-ui';

const windowWindth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class SearchPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: '',      // Input 中的值
        };
        this.pageLeft = new Animated.Value(windowWindth);
    }
    _pageHidden(){
        Animated.timing(
            this.pageLeft,{
                toValue: windowWindth,
                duration: 200
            }
        ).start(()=>{this.props.onCancelPress && this.props.onCancelPress();});
    }
    _pageShow(){
        Animated.timing(
            this.pageLeft,{
                toValue: 0,
                duration: 200
            }
        ).start(()=>{this._textInput.focus()});
    }
    // 点击取消键回调函数
    _cancel(){
        this._pageHidden();
    }
    // 点击软键盘上【搜索】键
    _searchSubmit(){
        Animated.timing(
            this.pageLeft,{
                toValue: windowWindth,
                duration: 200
            }
        ).start(()=>{
            this.props.onCancelPress && this.props.onCancelPress();
            this.props.onSearch && this.props.onSearch(this.state.value);
        });
    }
    // 点击 Group 中的某一项，执行外部传递进来的 onGroupChange 回调
    _popoverPress(selectedIndex){
        let group = this.props.groups[selectedIndex];
        this.props.onGroupChange && this.props.onGroupChange(group);
    }
    // 生成 Group 内容
    _generatePopoverContent(){
        let groups = this.props.groups;
        if (groups.length){
            return (
                <Popover.Menu>
                    {groups.map((item, index)=>{
                        return <Popover.Menu.Item key={index} onPress={this._popoverPress.bind(this, index)}>{item.label}</Popover.Menu.Item>;
                    })}
                </Popover.Menu>
            );
        }
    }
    // Input 中的值变化回调函数，并执行外部的 onValueChange 回调
    _onChangeText(value){
        this.setState({value});
        this.props.onValueChange && this.props.onValueChange(value);
    }
    render(){
        // 通过 selectedGroup 传递过来的 value 值，找到对应的在 groups 数组中的索引 selectedIndex，若找不到，默认 selectedIndex = 0
        let groups = this.props.groups,
            selectedGroup = this.props.selectedGroup, i, selectedIndex;
        if (groups.length){
            for (i = 0; i < groups.length; i++){
                if (selectedGroup === groups[i].value){
                    selectedIndex = i;
                    break;
                }
            }
        }
        if (i >= groups.length) {selectedIndex = 0;}
        return (
            <Modal visible={this.props.visible} onRequestClose={this._pageHidden.bind(this)} animationType={'none'} transparent={true}>
                <Animated.View style={[styles.pageContainer, {left: this.pageLeft}]}>
                    <View style={[{ height: Platform.OS === 'ios' ? 20 : 0 }, windowHeight === 812 ? { marginTop: 25 } : {}]} />

                    <View style={styles.searchContainer}>
                        <View style={[styles.searchBox]}>
                            {
                                // 通过 groups.length 判断是否是拓展型，如果是拓展型，则渲染 Popover; 如果不是拓展型，则渲染 SearchIcon
                                !groups.length ?
                                    <View style={styles.searchIcon}>
                                        <Icon type="search" size="md"/>
                                    </View>
                                    :
                                    <Popover content={this._generatePopoverContent()} placement="bottom">
                                        <View style={styles.searchGroup}>
                                            <Text style={styles.groupText}>{groups[selectedIndex].label}</Text>
                                            <Icon type="caretDown" size="xs"/>
                                            <View style={styles.vLine}/>
                                        </View>
                                    </Popover>
                            }
                            <TextInput
                                ref={(com)=>{this._textInput = com}}
                                style={styles.searchInput}
                                onChangeText={this._onChangeText.bind(this)}
                                value={this.state.value}
                                placeholder={this.props.focusPlaceholder || ''}
                                placeholderTextColor={'#BBBBBB'}
                                autoFocus={true}
                                returnKeyType={'search'}
                                returnKeyLabel={'search'}
                                enablesReturnKeyAutomatically={false}   // 文本框没有值是不禁用确认按钮
                                onSubmitEditing={this._searchSubmit.bind(this)}
                                underlineColorAndroid={'transparent'}  // android取消文本框下划线
                            />
                            {
                                this.state.value ?
                                    <TouchableOpacity onPress={()=>{this.setState({value: ''}); this.props.onValueChange && this.props.onValueChange('');}}>
                                        <View style={styles.cancelIcon}>
                                            <Icon type="closeCircle" size="md" color={Color.B3}/>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                        </View>
                        <TouchableOpacity onPress={this._cancel.bind(this)}>
                            <Text style={styles.cancelText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {this._renderHistory()}
                        {this._renderRecommend()}
                        {this._renderMatchKeywords()}
                    </ScrollView>
                </Animated.View>
            </Modal>
        );
    }
    componentDidMount(){
        this.props.visible ? this._pageShow() : null;
    }
    componentDidUpdate(){
        this.props.visible ? this._pageShow() : null;
    }
    _renderHistory(){
        // Section 优先展示 matchKeywords, 在 matchKeywords 模式下而且输入框有值得情况下，只显示 matchKeywords，不显示 searchHistory 和 searchRecommend
        if (!(!!this.props.matchKeywords.length && this.state.value) && !!this.props.searchHistory){
            // 判断 searchHistory 是否为数组, 不是数组则是 React.Component
            if (this.props.searchHistory instanceof Array){
                return !!this.props.searchHistory.length &&
                    <Section title={'搜索历史'} items={this.props.searchHistory} onSearch={this.props.onSearch} pageHidden={this._pageHidden.bind(this)} clearHistory = {this.props.clearHistory}/>;
            } else {
                return <Section itemComponent={this.props.searchHistory}/>;
            }
        }
    }
    _renderRecommend(){
        // Section 优先展示 matchKeywords, 在 matchKeywords 模式下而且输入框有值得情况下，只显示 matchKeywords，不显示 searchHistory 和 searchRecommend
        if (!(!!this.props.matchKeywords.length && this.state.value) && !!this.props.searchRecommend){
            // 判断 searchHistory 是否为数组, 不是数组则是 React.Component
            if (this.props.searchRecommend instanceof Array){
                return !!this.props.searchRecommend.length && <Section title={'大家都在找'} items={this.props.searchRecommend} onSearch={this.props.onSearch}/>;
            } else {
                return <Section itemComponent={this.props.searchRecommend}/>;
            }
        }
    }
    _renderMatchKeywords(){
        /*
        * 把匹配成功的字符串挑出来，并且按照搜索关键词把字符串分割，保留匹配字符，返回二维数组
        * [
        *   ['xx', '宝马', 'xx'],
        *   ['xx', '宝马', 'xx', '宝马'],
        *   ['xx', '宝马', 'xx'],
        * ]
        * matchedArr: 匹配成功,还未分割的一维数组
        * splitedArr: 分割完成后的二维数组
        * */
        if (this.props.matchKeywords.length && this.state.value){
            let keywordsArr = this.props.matchKeywords;
            let matchingValue = this.state.value;
            let matchedArr = keywordsArr.filter((item) => {
                if (item.toLowerCase().indexOf(matchingValue.toLowerCase()) >= 0){
                    return true;
                }
            });
            if (!matchedArr.length) {matchedArr.push('抱歉,暂无相关品牌或车系');}

            let splitedArr = [];
            let req = new RegExp('(' + this.state.value + ')', 'i');   // 使用捕获型括号的正则匹配 split ,结果数组可以保留分隔符
            matchedArr.forEach((item) => {
                splitedArr.push(item.split(req));
            });
            return (
                <Section keyWordsItems={splitedArr} keyword={this.state.value} onSearch={this.props.onSearch} originItems={matchedArr}/>
            );
        }
    }
}

SearchPage.propTypes = {
    onCancelPress: PropTypes.func,
    onSearch: PropTypes.func,
    groups: PropTypes.array,
    selectedGroup: PropTypes.string,
    onValueChange: PropTypes.func,
    visible: PropTypes.bool,
    focusPlaceholder: PropTypes.string,
    matchKeywords: PropTypes.array,
    searchHistory: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element,
    ]),
    clearHistory: PropTypes.func,
    searchRecommend: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element,
    ])
};

/*
* 用于渲染 searchHistory, searchRecommend 和 matchKeywords
* */
class Section extends React.Component{
    _onPress(index){
        if (this.props.originItems){
            this.props.pageHidden && this.props.pageHidden()
            this.props.onSearch && this.props.onSearch(this.props.originItems[index]);
        } else {
            this.props.pageHidden && this.props.pageHidden()
            this.props.onSearch && this.props.items && this.props.onSearch(this.props.items[index]);
        }
    }
    _onPressIn(index){
        this[index].setNativeProps({style: {
            backgroundColor: Color.G3
        }});
    }
    _onPressOut(index){
        this[index].setNativeProps({style: {
            backgroundColor: Color.G6
        }});
    }
    // 点击清空历史触发的回调，执行外部的 clearHistory 操作
    _clearHistory(){
        this.props.clearHistory && this.props.clearHistory();
    }
    _renderTitle(){
        return (
            !!this.props.title &&
            <View style={[styles.sectionItemView]}>
                <View style={[styles.itemTextView, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 18}]}>
                    <Text style={[styles.sectionItem, {color: Color.B3}]}>{this.props.title}</Text>
                    <TouchableOpacity onPress={this._clearHistory.bind(this)}>
                        {this.props.title === '搜索历史' && <Image style={{width: 20, height: 20}} source={{uri: 'https://assets.souche.com/assets/sccimg/common/common_button_deletehistory_m_3x.png'}}/>}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    /*
    * 渲染搜索历史或者推荐搜索，如果两者都有，则推荐跟在历史后面
    * */
    _renderHistoryAndRecommend(){
        let items = this.props.items;
        if (this.props.title === '搜索历史' && items.length > 5) {items.splice(5, items.length - 5);}
        return (
            !!items && !!items.length && (items.map((item, index) => {
                return (
                    <TouchableWithoutFeedback key={index} onPressIn={this._onPressIn.bind(this, index)} onPressOut={this._onPressOut.bind(this, index)} onPress={this._onPress.bind(this, index)}>
                        <View ref={(component)=>{this[index] = component;}} style={styles.sectionItemView}>
                            <View style={styles.itemTextView}>
                                <Text style={styles.sectionItem}>{item}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
            }))
        );
    }
    /*
    * 渲染关键词匹配，匹配到的字符高亮
    * */
    _renderMatchKeywords(){
        return (
            !!this.props.keyWordsItems && !!this.props.keyWordsItems.length && (this.props.keyWordsItems.map((item, index) => {
                return (
                    <TouchableWithoutFeedback key={index} onPressIn={this._onPressIn.bind(this, index)} onPressOut={this._onPressOut.bind(this, index)} onPress={this._onPress.bind(this, index)}>
                        <View ref={(component)=>{this[index] = component;}} style={styles.sectionItemView}>
                            <View style={[styles.itemTextView, {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}]}>
                                {item.map((label, labelIndex)=>{
                                    let hightLight = (label === this.props.keyword ? {color: Color.Orange1} : {});
                                    return <Text key={labelIndex} style={[styles.sectionItem, hightLight]}>{label}</Text>;
                                })}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
            }))
        );
    }
    /*
    * 当搜索历史或者推荐搜索为 React 组件时，直接渲染，不做任何操作
    * */
    _renderItemComponent(){
        return this.props.itemComponent;
    }
    render(){
        return (
            <View style={styles.sectionContainer}>
                {this._renderTitle()}
                {this._renderHistoryAndRecommend()}
                {this._renderMatchKeywords()}
                {this._renderItemComponent()}
            </View>
        );
    }
}

Section.propTypes = {
    items: PropTypes.array,
    onSearch: PropTypes.func,
    originItems: PropTypes.array,
    clearHistory: PropTypes.func,
    title: PropTypes.string,
    keyWordsItems: PropTypes.array,
    itemComponent: PropTypes.element
};

const styles = StyleSheet.create({
        pageContainer: {
            backgroundColor: Color.G6,
            flex: 1
        },
        searchContainer: {
            height: 44,
            flexDirection: 'row',
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#F2F2F2',
        },
        searchBox: {
            height: 30,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor: '#F2F2F2',
        },
        searchIcon: {
            height: 30,
            justifyContent: 'center',
            paddingLeft: 8,
            paddingRight: 4
        },
        searchInput: {
            height: 30,
            flex: 1,
            fontSize: FontSize.P2,
            color: Color.B1,
            padding: 0,    // 兼容 android 文字不能显示全
        },
        cancelIcon: {
            height: 30,
            justifyContent: 'center',
            paddingRight: 8
        },
        cancelText: {
            fontSize: FontSize.P1,
            color: Color.Orange1,
            paddingLeft: 16,
            // paddingRight: 16,  // container 本身有 paddingRight
        },
        sectionContainer: {},
        sectionItemView: {
            height: 48,
            paddingLeft: 16
        },
        itemTextView: {
            height: 48,
            borderBottomWidth: 1,
            borderBottomColor: '#EAEAEA',
            justifyContent: 'center',
        },
        sectionItem: {
            fontSize: FontSize.P1,
            color: Color.B1,
        },
        popover:{
            justifyContent: 'center'
        },
        searchGroup:{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 12,
        },
        groupText: {
            fontSize: FontSize.P2,
            color: Color.B1,
            marginRight: 6
        },
        vLine: {
            height: FontSize.P2,
            width: 0,
            borderLeftWidth: 1,
            borderLeftColor: Color.G2,
            marginLeft: 12,
            marginRight: 12,
        }
});