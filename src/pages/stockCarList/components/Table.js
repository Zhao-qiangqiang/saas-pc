import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    PixelRatio,
    Dimensions
} from 'react-native'
import { observer } from '@souche-f2e/srn-framework'
import { Search, Color, Tabs, Form, Radio, Tag, Grid } from '@souche-ui/srn-ui'
const windoWidth = Dimensions.get('window').width
const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize(dp)
@observer
export default class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 'b1',
            carList: []
        }
    }
    render() {
        const {column, dataSource, tableWidth} = this.props
        console.log('column---->', column);
        console.log('dataSource',dataSource)
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    {/* <View style={{
                        shadowColor:'#000',
                        shadowOffset:{width:2,height:-2},
                        shadowOpacity:0.4,
                        shadowRadius:2,
                        elevation:2,
                        marginLeft:2,
                        width:186/PixelRatio.get(),
                        zIndex:100
                        }}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableFirst} >测试</Text>
                            </View>
                            <View style={styles.tableBody1} >
                                <Text style={styles.tableContent1}>测试标题测试标题测试标题</Text>
                            </View>
                        </View>
                        <ScrollView horizontal={true} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false}
                    bounces={false} style={{}}>
                        <View>
                            <View style={styles.tableHeader}>
                                <View style={{width:186/PixelRatio.get(),marginLeft:64/PixelRatio.get()}}>
                                    <Text style={styles.tableTitle}>在库</Text>
                                </View>
                                <View  style={{width:186/PixelRatio.get(),marginLeft:64/PixelRatio.get()}}>
                                    <Text style={styles.tableTitle}>在库122在苦</Text>
                                </View>
                                <View  style={{width:186/PixelRatio.get(),marginLeft:64/PixelRatio.get()}}>
                                    <Text style={styles.tableTitle}>在库2</Text>
                                </View>
                                <View  style={{width:186/PixelRatio.get(),marginLeft:64/PixelRatio.get()}}>
                                    <Text style={styles.tableTitle}>在库3</Text>
                                </View>
                            </View>
                            <View style={styles.tableBody}>
                                    <View style={{width:186/PixelRatio.get(),marginLeft:64/PixelRatio.get()}}>
                                        <Text style={styles.tableContent} >1</Text>
                                    </View>
                                    <View style={{width:186/PixelRatio.get(),marginLeft:64/PixelRatio.get()}}>
                                        <Text style={styles.tableContent} >2</Text>
                                    </View>
                                    <View style={{width:186/PixelRatio.get(),marginLeft:64/PixelRatio.get()}}>
                                        <Text style={styles.tableContent} >3</Text>
                                    </View>
                                </View>
                        </View>
                    </ScrollView> */}
                    <View
                        style={{
                            shadowColor: '#999999',
                            shadowOffset: { width: 2, height: -2 },
                            shadowOpacity: 0.4,
                            shadowRadius: 2,
                            elevation: 2,
                            marginLeft: 2,
                            borderRightColor: '#cccccc',
                            borderRightWidth: 1,
                            width: 186 / PixelRatio.get(),
                            zIndex: 100
                        }}>
                        <View style={styles.tableHeader1}>
                            {column.map((element, indexHeader) => {
                                return (
                                    <View
                                        style={{
                                            height: element.tabHeight,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            display:
                                                indexHeader === 0
                                                    ? 'flex'
                                                    : 'none'
                                        }}>
                                        <Text
                                            style={{
                                                textAlign: 'right',
                                                fontSize: 14,
                                                color: '#8D8E99'
                                            }}
                                            key={element.key}>
                                            {element.title}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>
                        {dataSource.map((item, index) => {
                            return (
                                <View style={styles.tableBody1} key={item.key}>
                                    {column.map((itemBody, indexBody) => {
                                        return (
                                            <Text
                                                style={
                                                    indexBody === 0
                                                        ? styles.tableContent1
                                                        : styles.show
                                                }
                                                key={itemBody.key}>
                                                {item[itemBody.key]}
                                            </Text>
                                        )
                                    })}
                                </View>
                            )
                        })}
                    </View>
                    <ScrollView
                        horizontal={true}
                        alwaysBounceHorizontal={false}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}>
                        <View>
                            <View style={styles.tableHeader}>
                                {column.map((element, indexHeader) => {
                                    return (
                                        <View
                                            style={{
                                                width: 186 / PixelRatio.get(),
                                                marginLeft:
                                                    indexHeader === 1
                                                        ? 32 / PixelRatio.get()
                                                        : 64 / PixelRatio.get(),
                                                height: element.tabHeight,
                                                justifyContent: 'center',
                                                display:
                                                    indexHeader !== 0
                                                        ? 'flex'
                                                        : 'none'
                                            }}>
                                            <Text
                                                style={{
                                                    textAlign: 'right',
                                                    fontSize: 14,
                                                    color: '#8D8E99'
                                                }}
                                                key={element.key}>
                                                {element.title}
                                            </Text>
                                        </View>
                                    )
                                })}
                            </View>
                            {dataSource.map((item, index) => {
                                return (
                                    <View
                                        style={styles.tableBody}
                                        key={item.key}>
                                        {column.map((itemBody, indexBody) => {
                                            return (
                                                <View
                                                    style={{
                                                        width:
                                                            186 /
                                                            PixelRatio.get(),
                                                        marginLeft:
                                                            indexBody === 1
                                                                ? 32 /
                                                                  PixelRatio.get()
                                                                : 64 /
                                                                  PixelRatio.get(),
                                                        paddingRight:
                                                            indexBody ===
                                                            column.length
                                                                ? 32 /
                                                                  PixelRatio.get()
                                                                : 0,
                                                        display:
                                                            indexBody !== 0
                                                                ? 'flex'
                                                                : 'none'
                                                    }}>
                                                    <Text
                                                        style={
                                                            styles.tableContent
                                                        }
                                                        key={itemBody.key}>
                                                        {item[itemBody.key]}
                                                    </Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.White1
    },
    show: {
        display: 'none'
    },
    tableHeader1: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D7D8DB',
        alignItems: 'center',
        paddingLeft: 32 / PixelRatio.get()
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D7D8DB',
        paddingRight: 32 / PixelRatio.get()
    },
    tableFirst: {
        textAlign: 'right',
        fontSize: 14,
        color: '#8D8E99'
    },
    tableTitle: {
        textAlign: 'right',
        fontSize: 14,
        color: '#8D8E99',
        paddingTop: 12,
        paddingBottom: 12
    },
    tableContent: {
        textAlign: 'right',
        fontSize: 14
    },
    tableContent1: {
        textAlign: 'left',
        fontSize: 14
    },
    tableBody: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D7D8DB',
        paddingRight: 32 / PixelRatio.get()
    },
    tableBody1: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D7D8DB',
        paddingLeft: 32 / PixelRatio.get()
    }
})
