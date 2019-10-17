import React from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView,StyleSheet,TouchableWithoutFeedback, Image, InteractionManager, Platform} from 'react-native';
import {FontSize,Color,Icon} from '@souche-ui/srn-ui';
import PropTypes from 'prop-types';

class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: this.props.defaultValue || '',      // Input 中的值
        };

        this._onChangeText = this._onChangeText.bind(this);
        this._onClear = this._onClear.bind(this);
        this._searchSubmit = this._searchSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.defaultValue
        });
    }
    componentDidMount() {
        /**
         * 在动画完后再唤起键盘，防止卡顿
         * TextInput 中不设置 autoFocus
         */
        // InteractionManager.runAfterInteractions(() => {
        //     this.input && this.input.focus && this.input.focus();
        // });
    }

    // Input 中的值变化回调函数，并执行外部的 onValueChange 回调
    _onChangeText(value){
        this.setState({value});
        // 给外部 onValueChange 一个节流
        clearTimeout(this.throttleId);
        this.throttleId = setTimeout(()=>{
            this.props.onValueChange && this.props.onValueChange(value);
        }, this.throttleDelay);
    }
    //Input 获取焦点时触发回调函数
    _onFocus(){
        clearTimeout(this.throttleId);
        this.throttleId = setTimeout(()=>{
            this.props.onFocus && this.props.onFocus();
        }, this.throttleDelay);
    }

    //Input 失去焦点时触发函数 
    _onBlur(){
        clearTimeout(this.throttleId);
        this.throttleId = setTimeout(()=>{
            this.props.onBlur && this.props.onBlur();
        }, this.throttleDelay);
    }

    // 点击输入框后的清空按钮
    _onClear() {
        this.throttleId && clearTimeout(this.throttleId);
        this.setState({value: ''});
        this.props.onValueChange && this.props.onValueChange('');
    }

    // 点击软键盘上【搜索】键
    _searchSubmit(){
        this.throttleId && clearTimeout(this.throttleId);
        this.props.onSearch && this.props.onSearch(this.state.value);
    }

    // 点击 Group 中的某一项，执行外部传递进来的 onGroupChange 回调
    _popoverPress(selectedIndex){
        let group = this.props.groups[selectedIndex];
        this.props.onGroupChange && this.props.onGroupChange(group);
    }

    _renderTextInput(){
        this.throttleDelay = this.props.throttleDelay || 0;      // valueChange 函数触发的节流延迟时间
        return (
                <TextInput
                    ref={c => { this.input = c; }}
                    style={[
                        styles.searchInput,
                        Platform.OS === 'ios' && styles.fixInput  // ios 上 textInput 不能竖直居中
                    ]}
                    onChangeText={this._onChangeText}
                    onBlur={()=>{this.props.onBlur && this.props.onBlur()}}
                    onFocus={()=>{this.props.onFocus && this.props.onFocus()}}
                    value={this.state.value||''}
                    placeholder={this.props.placeholder || ''}
                    placeholderTextColor={Color.G1}
                    // autoFocus={false}
                    returnKeyType={'search'}
                    returnKeyLabel={'search'}
                    enablesReturnKeyAutomatically={true}   // 文本框没有值是禁用确认按钮
                    onSubmitEditing={this._searchSubmit}
                    underlineColorAndroid={'transparent'}  // android取消文本框下划线
                />
        );
    }
    _renderGroup(){
        return (
            <View style={styles.searchIcon}>
                <Image
                    style={styles.searchIconImg}
                    resizeMode={'contain'}
                    source={{uri: 'https://assets.souche.com/assets/sccimg/common/newsearch.png'}}
                />
            </View>
        );
    }
    _renderCancelIcon(){
        // 通过 this.state.value 来判断是否需要渲染搜索框最后的 清空Icon
        return (
            this.state.value ?
                <TouchableOpacity onPress={this._onClear}>
                    <View style={styles.cancelIcon}>
                        <Icon type="closeCircle" size="md" color={Color.B3}/>
                    </View>
                </TouchableOpacity>
                :
                null
        );
    }


    render(){
        let pageFlexStyle = this.props.section ? {flex: 1} : null;    // 当没有 section 的时候，表明组件是页面内使用，不是跳转页面使用，组件不能撑满屏幕
        return (
            <View style={[styles.pageContainer, pageFlexStyle]}>
                <View style={styles.searchContainer}>
                    <View style={[styles.searchBox]}>
                        {this._renderGroup()}
                        {this._renderTextInput()}
                        {this._renderCancelIcon()}
                    </View>
                    {
                        this.props.cancel?
                        <TouchableOpacity onPress={()=>{this.props.onCancelPress && this.props.onCancelPress();}}>
                            <Text style={styles.cancelText}>取消</Text>
                        </TouchableOpacity>
                        :<View></View>
                    }
                </View>
            </View>
        );
    }
}
Search.Indicator = (props) => {
    return (
        <View style={styles.indicatorContainer}>
            <View style={[styles.indicatorBox]}>
                <Image
                    style={styles.searchIconImg}
                    resizeMode={'contain'}
                    source={{uri: 'https://assets.souche.com/assets/sccimg/common/newsearch.png'}}
                />
                <View style={styles.interval}/>
                <Text style={styles.indicatorPlaceholder}>{props.placeholder}</Text>
            </View>
        </View>
    );
};

export default Search;

Search.propTypes = {
    placeholder: PropTypes.string,
    section: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.element]),
    onCancelPress: PropTypes.func,
    onValueChange: PropTypes.func,
    throttleDelay: PropTypes.number,
    onSearch: PropTypes.func,
    groups: PropTypes.array,
    selectedGroup: PropTypes.string,
    onGroupChange: PropTypes.func,
    onBlur:PropTypes.func,
    onFocus:PropTypes.func,
    cancel:PropTypes.bool
};
Search.Indicator.propTypes = {
    placeholder: PropTypes.string,
};

const styles = StyleSheet.create({
    pageContainer: {},
    searchContainer: {
        backgroundColor: Color.G6,
        height: 44,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
    },
    searchBox: {
        height: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Color.G4,
    },
    searchIcon: {
        height: 30,
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 4
    },
    searchInput: {
        height: 30,
        flex: 1,
        fontSize: FontSize.P2,
        color: Color.B1,
        padding: 0,    // 兼容 android 文字不能显示全
    },
    fixInput: {
        paddingTop: 1.67,
    },
    cancelIcon: {
        height: 30,
        justifyContent: 'center',
        paddingRight: 8
    },
    cancelText: {
        fontSize: FontSize.P1,
        color: Color.Primary,
        paddingLeft: 16,
        backgroundColor: Color.G6,
    },
    sectionContainer: {
        backgroundColor: Color.G6,
    },
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
    itemTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 18
    },
    sectionItem: {
        fontSize: FontSize.P1,
        color: Color.B1,
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
    },
    indicatorContainer: {
        height: 44,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorBox: {
        height: 30,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 15,
        backgroundColor: Color.G4,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
    },
    indicatorPlaceholder: {
        fontSize: FontSize.P2,
        color: Color.G1
    },
    searchIconImg: {
        width: 16,
        height: 16,
    },
    scrollViewContainer: {
        flex: 1
    },
    interval: {
        width: 4
    }
});