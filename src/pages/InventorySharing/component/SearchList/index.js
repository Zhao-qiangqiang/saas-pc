import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    NativeModules,
    InteractionManager,
    DatePickerIOS,
    Dimensions,
    PixelRatio,
    ScrollView,
    TouchableOpacity,
    CameraRoll,
    Platform,
    FlatList,
    RefreshControl,
} from 'react-native';

import { SRNPage, observer, LifeCircle } from '@souche-f2e/srn-framework';
import NavHelper from '@souche-f2e/srn-navigator';
import { Input, Form, Icon, Button, WingBlank, toast, loading, Modal, modal } from '@souche-ui/srn-ui';
import SRNNative from '@souche-f2e/srn-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@LifeCircle
@observer
@loading
@modal
class searchList extends SRNPage {
    static navigation = {
        title: {
            text: ''
        },
        left: {
            showArrow: true,
            onPress: function () {
                NavHelper.pop()
            }
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            dataList: [],  // 存放数组
        }
    }
    componentWillMount() {
        SRNNative.Loading.show()
    }

    componentDidMount() {
        let title = '';
        let dataList = [];
        switch (this.props.condition) {
            case "carModelColor":
                title = '车身色'
                dataList = this.props.store.carColorList || []
                break;
            case "carModelInColor":
                title = '内饰色'
                dataList = this.props.store.carInColorList || []
                break;
            case "delear":
                title = '经销商'
                dataList = this.props.store.dealerList || []
            default:
                break;
        }
        this.setNavigation({
            title
        })

        if (dataList.length > 0) {
            console.log(dataList)
            this.setState({
                dataList
            }, () => {
                SRNNative.Loading.hide(); // 为了保证页面上能看到列表
            })
        } else {
            SRNNative.Loading.hide();
        }
    }


    // 选择完回调函数 获取选择的id name
    backChoose(item) {
        let isHas = item ? false : true
        NavHelper.pop()
        switch (this.props.condition) {
            case "carModelColor":
                this.props.store.getSearchInfo(isHas ? '不限颜色' : item.name, 'EXTERIORCOLOR')
                this.props.store.getSearchInfo(isHas ? '' : item.value, 'EXTERIORCOLORID')
                break;
            case "carModelInColor":
                this.props.store.getSearchInfo(isHas ? '不限颜色' : item.name, 'INTERIORCOLOR')
                this.props.store.getSearchInfo(isHas ? '' : item.value, 'INTERIORCOLORID')
                break;
            case "delear":
                this.props.store.getSearchInfo(isHas ? '不限组织' : item.name, 'DEALER')
                this.props.store.getSearchInfo(isHas ? '' : item.value, 'ORGID')
                break;
            default:
                break;
        }
    }


    render() {
        return (
            <ScrollView style={{ backgroundColor: 'white' }}>
                {this.state.dataList.length > 0 ? (
                    <View>
                        <TouchableOpacity onPress={this.backChoose.bind(this, null)}>
                            <View style={styles.color}>
                                <Text style={styles.text}>{this.props.condition == 'delear' ? "不限组织" : '不限颜色'}</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.dataList.map(item => {
                            return (
                                <TouchableOpacity onPress={this.backChoose.bind(this, item)}>
                                    <View style={styles.color}>
                                        <Text style={styles.text}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                ) : (
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
                            <Image style={{ width: 144, height: 144 }} source={{ uri: 'https://assets.souche.com/assets/sccimg/chuanshanjia/loadingList.png' }}></Image>
                            <Text style={{ marginTop: 8, color: '#1B1C33', fontSize: 16 }}>未查询到结果</Text>
                        </View>
                    )}
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    color: {
        paddingBottom: "5%",
        paddingTop: "5%",
        borderBottomColor: "#E8E8E8",
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    text: {
        marginLeft: "3%",
        fontSize: 14
    }
});

export default searchList