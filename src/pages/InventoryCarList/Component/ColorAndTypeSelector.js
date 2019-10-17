import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';
import {
    FontSize,
    Button,
    theme,
    Checkbox,
    Grid,
    List,
} from '@souche-ui/srn-ui';
import {NavHelper} from '@souche-f2e/srn';
import { SRNConfig } from '@souche-f2e/srn-framework';
import CarBrandSelect from '@souche-ui/RNCarBrandSelect';

//配置查询接口
const APIConfig = {
    //车辆列表查询
    GetThrCarSeriesCatalogByOrg: `${SRNConfig.pangolin}/pangolinEntrance/getThrCarSeriesCatalogByOrg.json`,
   
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import InventoryCarListStore from '../../../stores/InventoryCarListStore';

export default class ColorAndTypeSelector extends React.Component {

    constructor(props) {
        super(props);
        const { defaultValue } = this.props
        this.state = {
            result: defaultValue || {},
            carExtra:'请选择',//车型选择文字显示
            carSelectList:[],//车型选择数据列表
        }
        this.store = new InventoryCarListStore()

        this.handleSelect = this.handleSelect.bind(this);
        this.resetSelect = this.resetSelect.bind(this);
        this.onPressCar = this.onPressCar.bind(this);

        this.changeTag = this.changeTag.bind(this);
        this.makeGridLayoutRenderer = this.makeGridLayoutRenderer.bind(this);


    }
    componentWillReceiveProps(nextProps){
        // console.log(`执行了nextProps`)
        this.setState({
            result:nextProps.filterDefaultValue.extra
        })
    }

    onPressCar() {
        const { store } = this.props
        const { carSelectList } = this.state

        var carBrand = new CarBrandSelect();
        if(store.carBrandList.length > 0){
            NavHelper.push(carBrand.carSeries,{
                unlimitedBrand:0,
                unlimitedSeries:0,
                selectType: 2,//多个车型 
                detailType:1,
                items:carSelectList,//默认值
                brandApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=1&code=`,
                seriesApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=2`,
                modelApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=3`
            });
            
        }else{
            NavHelper.push(carBrand.carSeries,{
                unlimitedBrand:0,
                unlimitedSeries:0,
                selectType: 2,//多个车型 
                detailType:1,
                items:carSelectList,//默认值
                showBrand:store.carBrandList[0],//只有一个品牌的时候直接打开车系
                brandApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=1&code=`,
                seriesApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=2`,
                modelApi:`${APIConfig.GetThrCarSeriesCatalogByOrg}?type=3`
            });
        }

        carBrand.onSelect((data)=>{
            const { onSelectedCar } = this.props
            this.setState({
                carSelectList:data.items
            })

            let lavel = 2
            data.items && data.items[0].items && data.items[0].items[0].items && (lavel = 3)
             
            if(lavel == 2 ){
                //如果是2级，选中之后查询车型具体列表，查询数据拿到所有车型 ，显示 已选择1个车型
                this.store.GetThrSeriesCatalogByOrg({
                    type:3,
                    code:data.items[0].items[0].code
                }).then(res => {
                    if(res && res.length > 0){
                        //说明查询到数据了, 赋值
                        let carExtra = '请选择'
                        if(res.length > 1){
                            carExtra = `已选择${res.length}个车型`
                        }else{
                            carExtra = `${res[0].name}`
                        }
    
                        this.setState({ carExtra })
                        onSelectedCar && onSelectedCar(res)
                    }
                })
            }else{
               //如果是3级，选中之后如果是一个，显示车型，多个显示多个车型
               let carExtra = '请选择'
               const carList = data.items[0].items[0].items
              if(carList.length > 1){
                carExtra = `已选择${carList.length}个车型`
              }else{
                carExtra = `${carList[0].name}`
              }
              this.setState({ carExtra })
               onSelectedCar && onSelectedCar(data.items[0].items[0].items)
            }
        })
    }


    handleSelect() {
        const { result } = this.state
        const { onSelect } = this.props;
        onSelect && onSelect(result);
    }
    //重置按钮
    resetSelect() {
        const result = {
            carTag: [{ label: '全部', value: 'all' }],
            libraryAge: [{ label: '全部', value: 'all' }],
            price: [{ label: '全部', value: 'all' }],
            interestholiday: [{ label: '全部', value: 'all' }]
        }
        this.setState({
            result,
            carSelectList:[],
            carExtra:'请选择'
        })
        
        const { resetSelectFn } = this.props 
        resetSelectFn && resetSelectFn(result,[])
    }
    /**
     * 标签多选
     * @param {*} selected 数据源
     * @param {*} tag 标识
     */
    changeTag(selected, value, tag) {
        const { result } = this.state
        const { onTagClick } = this.props
        let allLabel = { label: '全部', value: 'all' }

        //如果数据里面只有全部一个，则点击还是全部
        value.length == 0 && selected.push(allLabel)

        //如果点击的是全部，则其他的取消选中
        if (value.length > 1 && value[value.length - 1] == 'all') {
            selected.length = 0
            selected.push(allLabel)
        }
        //如果里面有全部，并且还有其他数据， 则把全部取消选中，
        if (value.length > 1 && value[value.length - 1] != 'all') {
            let allIndex = selected.findIndex(item => item.value == 'all')
            allIndex > -1 && selected.splice(allIndex, 1)

        }

        result[tag] = selected;


        this.setState({ result })
        onTagClick && onTagClick(result)

    }
    /**
     * 
     * @param {*} cols  4等分
     * @param {*} width 宽度
     * @param {*} columnGap 
     * @param {*} rowGap 
     */
    makeGridLayoutRenderer(cols, width, columnGap, rowGap) {
        return (tags) => {
            return (
                <Grid
                    style={styles.grid}
                    cols={cols}
                    width={width}
                    columnGap={columnGap}
                    rowGap={rowGap}
                >
                    {tags.map(tag => {
                        return React.cloneElement(tag, { autoWidth: false });
                    })}
                </Grid>
            );
        };
    }
    render() {
        let _th = this
        const { result,carExtra } = this.state
        const {
            store: {
                carTagList, libraryAgeList, priceList, interestholidayList,pageInfo,
            },
        } = this.props;
        const carTagValue = result && result.carTag.map(item => item.value) || [];
        const libraryAgeValue = result && result.libraryAge.map(item => item.value) || [];
        const priceValue = result && result.price.map(item => item.value) || [];
        const interestholidayValue = result && result.interestholiday.map(item => item.value) || [];
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle}>
                    <Text style={styles.title}>库存标签</Text>
                    <Checkbox.Tag
                        defaultValue={carTagValue}
                        onChange={(value, selected) => {
                            _th.changeTag(selected, value, 'carTag')
                        }}
                        options={carTagList}
                        renderLayout={this.makeGridLayoutRenderer(4, SCREEN_WIDTH - 32, 8, 10)}
                    />
                    <Text style={styles.title}>库龄</Text>
                    <Checkbox.Tag
                        defaultValue={libraryAgeValue}
                        onChange={(value, selected) => {
                            _th.changeTag(selected, value, 'libraryAge')
                        }}
                        options={libraryAgeList}
                        renderLayout={this.makeGridLayoutRenderer(3, SCREEN_WIDTH - 32, 8, 10)}
                    />
                    <Text style={styles.title}>资金来源</Text>
                    <Checkbox.Tag
                        defaultValue={priceValue}
                        onChange={(value, selected) => {
                            _th.changeTag(selected, value, 'price')
                        }}
                        options={priceList}
                        renderLayout={this.makeGridLayoutRenderer(3, SCREEN_WIDTH - 32, 8, 10)}
                    />
                    <Text style={styles.title}>免息截止日期</Text>
                    <Checkbox.Tag
                        defaultValue={interestholidayValue}
                        onChange={(value, selected) => {
                            _th.changeTag(selected, value, 'interestholiday')
                        }}
                        options={interestholidayList}
                        renderLayout={this.makeGridLayoutRenderer(3, SCREEN_WIDTH - 32, 8, 10)}
                    />
                    <View style={styles.carSelectView}>
                        <View style={styles.carSelectStyle}>
                            <List.Item style={styles.singleton}
                                title={'车型筛选'} extra={ carExtra } 
                                extraColor='#666666' 
                                arrow={'right'}
                                onPress={this.onPressCar}
                            />
                        </View>
                    </View>
                    
                </ScrollView>


                <View style={styles.bottom}>
                    <Button key='reset' type="gray" style={styles.resetButton} onPress={this.resetSelect}>重置</Button>
                    <Button key='sure' type="primary" style={styles.bottomButton} onPress={this.handleSelect}>确定({pageInfo.totalNumber})</Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    grid: {
        paddingHorizontal: 16,
    },
    scrollViewStyle: {
        // paddingBottom: 33,
        height: SCREEN_HEIGHT * 0.60,
    },
    title: {
        marginHorizontal: 16,
        marginBottom: 16,
        marginTop: 16,
        fontSize: FontSize.P1,
        color: theme('color_text_title'),
    },
    carSelectView:{
        marginTop:32,
        marginBottom:26,
        paddingLeft: 16,
    },
    carSelectStyle: {
        borderTopColor: '#D9D9D9',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
    },
    singleton: {
        backgroundColor: 'white',
        paddingRight: 16,
    },
    bottom: {
        // backgroundColor:'pink',
        paddingVertical: 7,
        paddingHorizontal:16,
        flexDirection: 'row',
    },
    resetButton:{
        borderRadius:20,
        marginRight: 8,
        flex:1,

    },
    bottomButton: {
        borderRadius: 20,
        flex:3
    },

});