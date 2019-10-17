import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    PixelRatio
} from 'react-native';
import { observer } from '@souche-f2e/srn-framework';
import { theme, Tag, Color, Grid } from '@souche-ui/srn-ui';
const SCREEN_WIDTH = Dimensions.get('window').width;
@observer
// 销售顾问看板数据
class VendibilitySkeleton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={stylesExample.container}>
                <View>
                    <Text style={stylesExample.carSeries}></Text>
                    <View style={stylesExample.carSeriesList}>
                        <View style={stylesExample.carSeriesListCarModelColor}>
                            <View style={stylesExample.carSeriesListCarModelColorText}>
                                <Text style={stylesExample.carModelColor}> </Text>
                                <Text style={stylesExample.carModelColorSale}> </Text>
                                <Text style={stylesExample.age}> </Text>
                            </View>
                            <View style={stylesExample.carSeriesListCarModelColorArrow}>
                                <Text style={stylesExample.arrow}></Text>
                            </View>
                        </View>
                        <View style={stylesExample.carSeriesListCarModelColor}>
                            <View style={stylesExample.carSeriesListCarModelColorText}>
                                <Text style={stylesExample.carModelColor}> </Text>
                                <Text style={stylesExample.carModelColorSale}> </Text>
                                <Text style={stylesExample.age}> </Text>
                            </View>
                            <View style={stylesExample.carSeriesListCarModelColorArrow}>
                                <Text style={stylesExample.arrow}></Text>
                            </View>
                        </View>
                        <View style={[stylesExample.carSeriesListCarModelColor,stylesExample.backgroundColorWhite]}>
                            <View style={stylesExample.carSeriesListCarModelColorText}>
                                <Text style={stylesExample.carModelColor}></Text>
                                <Text style={stylesExample.carModelColorSale}> </Text>
                                <Text style={stylesExample.age}> </Text>
                            </View>
                            <View style={stylesExample.carSeriesListCarModelColorArrow}>
                                <Text style={stylesExample.arrow}></Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={stylesExample.carSeries}></Text>
                    <View style={stylesExample.carSeriesList}>
                            <View style={stylesExample.carSeriesListCarModelColor}>
                            <View style={stylesExample.carSeriesListCarModelColorText}>
                                <Text style={stylesExample.carModelColor}> </Text>
                                <Text style={stylesExample.carModelColorSale}> </Text>
                            </View>
                            <View style={stylesExample.carSeriesListCarModelColorArrow}>
                                <Text style={stylesExample.arrow}></Text>
                            </View>
                        </View>
                        <View style={[stylesExample.carSeriesListCarModelColor,stylesExample.backgroundColorWhite]}>
                            <View style={stylesExample.carSeriesListCarModelColorText}>
                                <Text style={stylesExample.carModelColor}></Text>
                                <Text style={stylesExample.carModelColorSale}> </Text>
                            </View>
                            <View style={stylesExample.carSeriesListCarModelColorArrow}>
                                <Text style={stylesExample.arrow}></Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const stylesExample = StyleSheet.create({
    wrapper: {
        marginVertical: 10,
        paddingHorizontal: 16,
    },
    container: {
        backgroundColor: Color.G4,
    },
    carSeries: {
        height: 38,
        backgroundColor: '#F2F3F5',
    },
    carSeriesChild: {

    },
    carSeriesList: {
        paddingLeft: 16,
        backgroundColor: Color.White1,
    },
    carSeriesListLast: {
        marginBottom: 0,
        paddingLeft: 16,
        backgroundColor: Color.White1,
    },
    carSeriesListCarModel: {
        paddingVertical: 21,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#DCDCDC',
    },
    carModel: {
        marginBottom: 12,
        height: 20,
        width: '80%',
        backgroundColor: Color.G6
    },
    carModelSale: {
        height: 12,
        width: '60%',
        backgroundColor: Color.G6
    },
    carSeriesListCarModelColor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#DCDCDC',
        paddingRight: 16,
        paddingVertical: 16,
    },
    backgroundColorWhite:{
        borderBottomColor: Color.White1,
    },
    carSeriesListCarModelColorText: {
        flex: 4
    },
    carSeriesListCarModelColorArrow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    carModelColor: {
        height: 16,
        marginBottom: 16,
        width: '100%',
        backgroundColor: Color.G6
    },
    carModelColorSale: {
        height: 12,
        width: '80%',
        backgroundColor: Color.G6,
        marginBottom: 9,
    },
    age:{
        height: 12,
        width: '70%',
        backgroundColor: Color.G6
    },
    arrow: {
        width: 16,
        height: 16,
        backgroundColor: Color.G6,
    },




    listItem: {
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#DCDCDC',
        paddingVertical: 16,
    },
    listItemLast: {
        borderBottomColor: Color.White1,
    },


    textStyle: {
        marginBottom: 8,
        height: 12,
        width: '50%',
        backgroundColor: Color.G6
    },
    marginBottom16: {
        marginBottom: 16,
    },
    width45: {
        width: '45%',
    },
    width60: {
        width: '60%',
    }

})

export default VendibilitySkeleton;
