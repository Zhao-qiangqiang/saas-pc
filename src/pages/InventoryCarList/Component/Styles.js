import {
    StyleSheet,
    Dimensions,
    PixelRatio
} from 'react-native';
import { Color, theme } from '@souche-ui/srn-ui';
const windoWidth = Dimensions.get('window').width;

const StylesExample = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.G4,
    },
    searchHeaderInput:{
        width: '92%',
        marginLeft: '6%',
    },
    wrapper: {
        marginVertical: 10,
        paddingHorizontal: 16,
        justifyContent: 'space-between'
    },
    hiddenView:{
        backgroundColor: Color.White1,
        height: 15,
    },
    view: {
        backgroundColor: Color.White1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        paddingBottom: 20 / PixelRatio.get()
    },
    inlineItemWrapper: {
        marginRight: 20 / PixelRatio.get(),
        marginBottom: 20 / PixelRatio.get()
    },
    tagList: {
        height: 30,
        marginLeft: 10
    },
    detail: {
        padding: 16,
        paddingBottom: 0,
        backgroundColor: Color.White1
    },
    noList:{
        flexDirection:'row',
        justifyContent:'center',
        paddingBottom: 0,
        backgroundColor: Color.White1,
        height:'100%'
    },
    imgStyle:{
        flexDirection:'column',
        // flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.White1,
        // backgroundColor: 'red',
        height:'100%',
        marginBottom: 60 / PixelRatio.get(),
    },

    
    carStock: {
        fontSize: 14
    },
    overdueCarStock: {
        color: '#FF4040',
        fontSize: 14
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

    grid: {
        marginVertical: 10,
        paddingHorizontal: 16
    },
    tagStyle:{
        backgroundColor: Color.White1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft:16,
    },
    tagItemWrapper:{
        marginRight: 6,
        marginBottom: 8,
    },
    tagTextStyle:{
        paddingHorizontal: 10,
        height: 30,
    },
    totalCar:{
        flexDirection:'row',
        paddingTop:16,
        paddingLeft:16,
        paddingBottom:8,
    },
    totalText:{
        color: '#999999', 
        fontSize: 14, 
    },
    scrollViewContainer:{
        backgroundColor: Color.White1,
        paddingLeft:16,
    },
    viewContainer:{
        paddingVertical:16,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#DCDCDC',
    },
    lastViewContainer:{
        borderBottomColor: '#fff',
    },
    carTitle: {
        fontSize: 16,
        color: theme('color_text_title'),
        fontWeight: 'bold',
        marginBottom:10,
    },
    carDec: {
        fontSize: 12,
        color: '#5E5E66',
        marginTop: 6
    },
    freeDate:{
        color:'#5E5E66'
    },
    overDate:{
        color:'#FF4040'
    }
});

export default StylesExample