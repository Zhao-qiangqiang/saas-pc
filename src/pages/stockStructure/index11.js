import React from 'react';


import {WebView, Easing,Animated,StyleSheet, View, Text, ScrollView, PixelRatio,TouchableOpacity,InteractionManager ,Image,FlatList,RefreshControl,Dimensions } from 'react-native';
import {
    SRNPage,
    observer,
    LifeCircle,
    SRNConfig,
    
} from '@souche-f2e/srn-framework';
import {
    Form,
    Icon,
    toast,
    Color,
    Tabs,
    PullToRefreshFlatList,
    loading,
    Picker,
    Popover,
    Switch ,
    theme
} from '@souche-ui/srn-ui';

import _ from 'lodash';
import Table from '../stockCarList/components/Table';
import SearchPart from './component/Search';
import NavHelper from '@souche-f2e/srn-navigator';
import { CarModelSelect } from '../../shared/components/CarModel';
import stockStrcuture from '../../stores/stockStrcuture';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@LifeCircle
@observer
@toast


class StockStructure extends SRNPage {
    static navigation = {
        title: {
            component: ({ emitter, sceneProps }) => {
                const routerProps = _.get(
                    sceneProps,
                    'scene.route.ComponentInstance.props',
                    {}
                );
                const { value = '' } = routerProps;
                return (
                    <View style={stylesExample.searchHeader}>
                        <SearchPart emitter={emitter} keyword={value} />
                    </View>
                );
            }
        },
        headerStyle: { borderBottomColor: '#FFFFFF' },
        left: {
            showArrow: true
        },
      
    }
    constructor(props){
        super(props);
        this.store = new stockStrcuture();
       
    }
    componentWillMount(){
        this.store.onRefresh(1)
        this.store.getlibraryAgeTitle()
    }

    componentDidMount(){
        console.log(this.store.libraryAgeTitleList)
        // this.refs.webview.postMessage(JSON.stringify(this.store.libraryAgeTitleList))
    }

    HTML_RN(event){
        let get_data = JSON.parse(event.nativeEvent.data);
        let data = {
            source:'点击之后再次传参',
        };
        console.log(get_data);
        this.refs.webviews.postMessage(JSON.stringify(data))
    }

    RN_HTML(){
        let data = {
            source:'dada rn',
        };
        this.refs.webviews.postMessage(JSON.stringify(data))
        console.log(this.refs.webviews)
        // window.postMessage("有没有数据") 
    }

    render(){
        return (
            <WebView 
                 ref="webviews"
                 source={require('./kanban.html')}
                 onMessage={this.HTML_RN.bind(this)}  //  接收h5的信息
                 onLoadEnd={this.RN_HTML.bind(this)}
            />
        );
    }
}

const stylesExample = StyleSheet.create({
   
});

export default StockStructure;