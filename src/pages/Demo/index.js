import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    InteractionManager,
    Dimensions
} from 'react-native';
// import SRNNative from '@souche-f2e/srn-native';
import { SRNPage, observer } from '@souche-f2e/srn-framework';
import NavHelper from '@souche-f2e/srn-navigator';
// 引入组件库
import { Icon, Button, List } from '@souche-ui/srn-ui';
// 引入公共组件
import { CarModelSelect } from '../../shared/components/CarModel';
// 引入子组件
import CarItemView from './components/CarItemView';
import SearchPart from './components/Search';
// 引入当前页面关联的 store
import DemoStore from '../../stores/demoStore';
import IndexStore from '../../stores/indexStore';
const SCREEN_WIDTH = Dimensions.get('window').width;
@observer
class Index extends SRNPage {
    static navigation = {
        title: {
            component: ({ emitter, sceneProps }) => {
                return (
                    <View style={styles.searchHeader}>
                        <SearchPart
                            style={styles.searchContent}
                            emitter={emitter}
                        />
                    </View>
                );
            }
        },
        left: {
            showArrow: true
        },
        right: {
            component: ({ emitter, sceneProps }) => {
                return (
                    <View style={styles.searchHeaderRight}>
                        <View style={styles.searchHeaderRightSub}>
                            <Text style={styles.searchHeaderRightSubText}>
                                筛选
                            </Text>
                        </View>
                    </View>
                );
            },
            onPress: (emitter, sceneProps) => {
                NavHelper.push(CarModelSelect, {
                    level: 2,
                    emitter,
                    title:'车系/车型'
                });
            }
        }
    }

    constructor() {
        super();
        this.demoStore = new DemoStore();
        this.store = new IndexStore();
        this.gotoCarModelSelect = this.gotoCarModelSelect.bind(this);
        this.selectCarModel = this.selectCarModel.bind(this);
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.emitter.on('selectCarModel', data => this.selectCarModel(data));
        });
    }

    selectCarModel(dataArr) {
        NavHelper.pop();
        this.demoStore.selectCarModel(dataArr);
    }

    gotoCarModelSelect() {
        NavHelper.push(CarModelSelect, {
            level: 3,
            selectedCbFunc: this.selectCarModel,
            title:'品牌/车系/车型'
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <CarItemView carData={this.demoStore} />
                <List>
                    <List.Item>
                        <View style={styles.buttonWrapper}>
                            <Button
                                type="primary"
                                onPress={this.gotoCarModelSelect}>
                                筛选
                            </Button>
                        </View>
                    </List.Item>
                </List>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchHeader: {
        width: 300
    },
    searchContent: {
        width: 300
    },
    searchHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchHeaderRightSub: {
        flex: 1
    },
    searchHeaderRightSubText: {
        fontSize: 14
    },
    buttonWrapper: {
        width: SCREEN_WIDTH * 0.9,
        padding: 10
    }
});

// 导出组件
export default Index;
