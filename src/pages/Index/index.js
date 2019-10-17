import React from 'react';
import {
    StyleSheet,
    View,
    InteractionManager,
    DatePickerIOS
} from 'react-native';
// import SRNNative from '@souche-f2e/srn-native';

import { SRNPage, observer } from '@souche-f2e/srn-framework';

// 从新版组件库中引入一个Button组件
import { Button } from '@souche-ui/srn-ui';

// 引入子组件
import CarItemView from './components/CarItemView';

// 引入当前页面关联的 store
// [SRNStore 数据管理] http://fedoc.sqaproxy.souche.com/#/rn/framework/framework_SRNStore
import IndexStore from '../../stores/indexStore';

/**
 * 如果组件需要和store自动联动，请添加此注解 @observer，否则不需要添加
 * [如何实现数据绑定] http://fedoc.sqaproxy.souche.com/#/rn/develop/basic_data_binding
 */
@observer
class Index extends SRNPage {

    // 定义当前页面的title，navigation中的所有元素都可以通过此处自定义
    // [SRNavigator 导航器] http://fedoc.sqaproxy.souche.com/#/rn/navigator/srn-navigator
    static navigation = {
        title: {
            text: '首页'
        }
    };

    /**
     * 组件构造函数，第一个被调用的生命周期
     */
    constructor () {
        super();
        // 务必在此实例化页面的 store
        this.store = new IndexStore();
    }

    /**
     * 组件即将挂载的生命周期
     */
    componentWillMount () {
        // 将页面数据构造放在此方法内，可以保证性能（在页面切换动画完毕后执行）
        InteractionManager.runAfterInteractions(() => {
            this.getData();
        });
    }

    /**
     * 页面结构在此，每次数据改变都会引起调用此方法
     * @returns {XML}
     */
    render () {
        return (
          <View style={styles.container}>
              <CarItemView recommendCar={this.store.recommendCar} />
              <Button onPress={
                  () => {
                      this.toList();
                  }
              }>跳转到列表页面</Button>
              <DatePickerIOS
                date={new Date()}
                mode="datetime"
                onDateChange={()=>{

                }}
              />
          </View>
        );
    }

    toList () {
        // 用 Route 跳转页面
         this.route.open('/List');
        /**
        SRNNative.openDatePicker({
            value: '2015/07/10',
            format: "yyyy/MM/dd HH:mm",
            minDate: '2014/07/20',
            maxDate: '2016/07/29',
            rightText: '确定',
            rightColor: '#FF5050',
            rightSize: '14',
            leftText: '只能使用8年',
            leftColor: '#000000',
            leftSize: '14'
        }).then(res => {
            console.log(res);
        });
        */
    }

    getData () {
        this.store.fetch();
    }
}

// 定义样式
// [如何布局界面] http://fedoc.sqaproxy.souche.com/#/rn/develop/dev_11
const styles = StyleSheet.create({
    container: {}
});

// 导出组件
export default Index;
