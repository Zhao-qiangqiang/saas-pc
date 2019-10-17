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
    RefreshControl,
    FlatList,
    Modal
} from 'react-native';

import { SRNPage, observer, LifeCircle } from '@souche-f2e/srn-framework';
import NavHelper from '@souche-f2e/srn-navigator';
import SRNNative from '@souche-f2e/srn-native';
import { Input,Form,Icon,Button,WingBlank,List,PullToRefreshFlatList,modal,loading } from '@souche-ui/srn-ui';
import { SharingSkeleton } from '../../../../components/skeleton'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ListItem = List.Item

@LifeCircle
@observer
@loading
@modal
class searchResult extends SRNPage{
    static navigation = {
        title:'查询结果',
        left:{
            showArrow: true,
            onPress(emitter) {
                emitter.emit('isPressFn')
            }
        }
    };
    
    constructor(props){
        super(props)
        this.state={
            confirmToast:'',
            data:"",
        }
    }

    
    componentWillMount(){
        SRNNative.Loading.show()
    }
    componentWillMount(){
        InteractionManager.runAfterInteractions(() => {
            this.emitter.on('isPressFn',data => {
                // 返回上一级时显示骨架屏
                this.props.store && this.props.store.isSEARCH_APIChange && 
                this.props.store.isSEARCH_APIChange(false)

                NavHelper.pop()
            })
        })
    }
    

    componentDidMount(){
        InteractionManager.runAfterInteractions(()=>{
            let data = this.props.tag == '1' ? this.props.store.searchChoose : this.props.store.historyChoose
            this.setState({
                data
            })
            // this.props.store._handleRefresh(data)
            this._handleRefresh()
        })
    }

    // 下拉刷新
    _handleRefresh(){
        this.props.store._handleRefresh(this.state.data)
        this.setState({
            confirmToast:'',
        })
    }



    // 上拉加载
    handleAppend(){
        if(!this.props.store.IsLastPage){
            let data = this.props.tag == '1' ? this.props.store.searchChoose : this.props.store.historyChoose
            this.props.store.getSearchResult(data)
            this.setState({
                confirmToast:''
            })
        }else{
            this.setState({
                confirmToast:'没有更多数据了!'
            })
        }
    }
    renderItem({item}){
        return(
            <View>
                {item.librariesNumber == 0 && item.routesNumber == 0 ? null : (
                    <View style={styles.flex}>
                        <Text style={styles.titleColor}>{item.carModelName}</Text>
                        <Text style={styles.historyColor}>外观{item.exteriorColor} | 内饰{item.interiorColor} | {item.storeName}</Text>
                        <Text style={styles.titleColor}>{item.librariesNumber == 0 ? null : `在库: ${item.librariesNumber}`} {item.routesNumber == 0 ? null : `在途: ${item.routesNumber}`}</Text>
                    </View>
                )}
            </View>

        )
    }

    render(){
        const { store } = this.props

        return(
            <View style={styles.all}>
                { store.isSEARCH_API ?
                <View>
                    {this.props.store.resultList.length > 0 ? (
                        <View>
                            <FlatList 
                                data={this.props.store.resultList} 
                                finished = {this.props.store.IsLastPage} 
                                onAppend={this.handleAppend.bind(this)} 
                                onEndReachedThreshold={0.3} 
                                renderItem={this.renderItem.bind(this)}
                                refreshControl={(
                                    <RefreshControl refreshing={this.props.store.refreshing}
                                    onRefresh={this._handleRefresh.bind(this)}/>
                                )}>
                            </FlatList>
                            <View><Text>{this.state.confirmToast}</Text></View>
                        </View>
                    ): (
                        <View style={{ flexDirection:'column',alignItems:'center',marginTop:80}}>
                            <Image style={{ width: 144, height: 144 }} source={{uri:'https://assets.souche.com/assets/sccimg/chuanshanjia/loadingList.png'}}></Image>
                            <Text style={{marginTop: 8 ,color:'#1B1C33',fontSize:16}}>未查询到结果</Text>
                        </View>
                    )}   
                </View> :
                <View>
                    <SharingSkeleton />
                </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    all:{
        backgroundColor:'white',
        paddingLeft:'3%',
        height:SCREEN_HEIGHT
    },
    historyColor:{
        color:'#B5B5B5',
        fontSize:12,
        paddingTop:5
    },
  
    flex:{
        paddingVertical:'3%',
        borderBottomColor:"#BBBBBB",
        borderBottomWidth:1,
        borderStyle:'solid',
    },

    title:{
        color:'#999999',
        fontSize:14,
        marginLeft:'3%',
    },

    titleColor:{
        color:'#1B1C33',
        fontSize:14,
        marginTop:10,
    },
});

export default searchResult