import React from 'react';
import { View, InteractionManager, Dimensions } from 'react-native';
import { Cascader, modal } from '@souche-ui/srn-ui';
import { observer, SRNConfig, SRNPage } from '@souche-f2e/srn-framework';
import SRNNative from '@souche-f2e/srn-native';
import { BLKSRNFetch } from '../../utils';
const APIConfig = {
    CARMODEL_API: `${
        SRNConfig.pangolin
    }/pangolinEntrance/getThrSeriesCatalogByOrg.json`,
    CARSERIES_API: `${SRNConfig.pangolin}/pangolinEntrance/getSeriesByOrg.json`
};
const SCREEN_WIDTH = Dimensions.get('window').width;
const LOADTEXT = '加载中...';
@observer
@modal
class CarModelSelect extends SRNPage {
    static navigation = {
        title: '车型筛选'
    }

    static propTypes = {
        level: React.PropTypes.number, //  只能为2或3{number}，3:品牌/车系/车型，2:车系/车型
        selectedCbFunc: React.PropTypes.func, // 选中后回调函数，普通传入回调
        emitter: React.PropTypes.object // 选中后回调函数，适用于监听事件回调
    }

    static defaultProps = {
        level: 3,
        selectedCbFunc: function() {},
        emitter: { emit: function() {} }
    }

    state = {
        visible: false,
        level: null,
        defaultSelectedItem: [{ rows: [] }]
    }

    level1Id = ''
    level2Id = ''

    constructor(props) {
        super(props);
        this._onSelected = this._onSelected.bind(this);
        this._getAllCarSeries = this._getAllCarSeries.bind(this);
        this._getAllCarBrand = this._getAllCarBrand.bind(this);
        this._getCarSeries = this._getCarSeries.bind(this);
        this._getCarType = this._getCarType.bind(this);
        this._getCascaderData = this._getCascaderData.bind(this);
        this._formatDataForCascader = this._formatDataForCascader.bind(this);
        this._formatRowsDataForCascader = this._formatRowsDataForCascader.bind(
            this
        );
        this._errorHandler = this._errorHandler.bind(this);
        this._callBack = this._callBack.bind(this);
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                visible: true
            });
        });
    }

    _onSelected(level, ...args) {
        if (level === this.props.level || args.some(arg => arg._all)) {
            this._callBack([...args]);
        } else if (level === 1) {
            this.level1Id = [...args][0].code;
        } else if (level === 2) {
            this.level2Id = [...args][1].code;
        }
    }

    _getAllCarSeries() {
        const url = APIConfig.CARSERIES_API;
        const options = {
            method: 'GET'
        };
        return this._fetchData(url, options, 'carSeries');
    }

    _getAllCarBrand() {
        const url = APIConfig.CARMODEL_API;
        const options = {
            method: 'GET',
            data: {
                type: 1,
                code: ''
            }
        };
        return this._fetchData(url, options, 'carBrand');
    }

    _getCarSeries() {
        const url = APIConfig.CARMODEL_API;
        const options = {
            method: 'GET',
            data: {
                code: this.level1Id,
                type: 2
            }
        };
        return this._fetchData(url, options, 'carSeries');
    }

    _getCarType() {
        const url = APIConfig.CARMODEL_API;
        const options = {
            method: 'GET',
            data: {
                // 三级取level2Id，二级取level1Id
                code: this.level2Id || this.level1Id,
                type: 3
            }
        };
        return this._fetchData(url, options, 'carType');
    }

    _fetchData(url, options, type) {
        SRNNative.Loading.show();
        const { defaultSelectedItem } = this.state;
        return BLKSRNFetch(url, options)
            .then(data => {
                SRNNative.Loading.hide();
                if (data) {
                    if (!data.length) {
                        this._errorHandler({
                            tip: '无数据',
                            confirmButtonText: '确认'
                        });
                        return defaultSelectedItem;
                    }
                    const newData = this._formatDataForCascader(data, {
                        type
                    });
                    return newData;
                } else {
                    this._errorHandler({
                        tip: '服务器错误',
                        confirmButtonText: '确认'
                    });
                    return defaultSelectedItem;
                }
            })
            .catch(e => {
                SRNNative.Loading.hide();
                this._errorHandler(
                    { tip: e.msg, confirmButtonText: '确认' },
                    true
                );
                return defaultSelectedItem;
            });
    }

    _formatDataForCascader(arr, options) {
        const { parentName, type } = options;
        if (!Array.isArray(arr)) {
            throw new Error('参数必须为数组');
        }
        const isAbledPropName = arr.some(
            item => item.id && item.name && item.code
        );
        // 适配接口返回的数据
        const newArr = isAbledPropName
            ? arr
            : this._formatRowsDataForCascader(arr, type);
        const newObj = { rows: newArr, section: parentName || '全部' };
        const formatedArr = [];
        formatedArr.push(newObj);
        return formatedArr;
    }

    _formatRowsDataForCascader(arr, type) {
        if (!Array.isArray(arr)) {
            throw new Error('参数必须为数组');
        }
        let newArr = null;
        switch (type) {
            case 'carBrand':
                newArr = arr.map(item => {
                    item.id = item.id || '';
                    item.code = item.brandCode || '';
                    item.name = item.brandName || '';
                    return item;
                });
                break;
            case 'carSeries':
                newArr = arr.map(item => {
                    item.id = item.id || '';
                    item.code = item.seriesCode || '';
                    item.name = item.seriesName || '';
                    return item;
                });
                break;
            case 'carType':
                newArr = arr.map(item => {
                    item.id = item.carSeriesId || item.id || '';
                    item.code = item.modelCode || item.modelCode || '';
                    item.name = item.modelName || item.modelName || '';
                    return item;
                });
                break;
            default:
                break;
        }

        return newArr;
    }

    _getCascaderData() {
        const { level } = this.props;
        let data = null;
        switch (level) {
            case 2:
                data = [this._getAllCarSeries, this._getCarType];
                break;
            case 3:
                data = [
                    this._getAllCarBrand,
                    this._getCarSeries,
                    this._getCarType
                ];
                break;
            default:
                data = [];
                throw new Error(`目前接收到的level为${level}，level只能为2或3`);
        }
        return data;
    }

    _errorHandler({ tip, confirmButtonText } = {}, quit = false) {
        this.modal({
            title: tip || '网络错误',
            options: [
                {
                    text: confirmButtonText || '确认',
                    onPress: () => {
                        quit && this._callBack();
                    }
                }
            ]
        });
    }

    _callBack(arr = []) {
        const { emitter, selectedCbFunc } = this.props;
        emitter && emitter.emit('selectCarModel', arr);
        selectedCbFunc && selectedCbFunc(arr);
    }

    render() {
        const { level } = this.props;
        const data = this._getCascaderData();
        if (level) {
            if (this.state.visible === true) {
                return (
                    <View style={{ flex: 1, width: SCREEN_WIDTH }}>
                        <Cascader onSelected={this._onSelected} data={data} />
                    </View>
                );
            } else {
                return <View />;
            }
        }
    }
}

export default CarModelSelect;
