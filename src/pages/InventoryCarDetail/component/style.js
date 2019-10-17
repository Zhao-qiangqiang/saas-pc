import {
    StyleSheet,
    PixelRatio
} from 'react-native';
import { Color, theme } from '@souche-ui/srn-ui';

const stylesExample = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme('color_background_page')
    },
    lockCarStyle: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: Color.White1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 7,
        paddingTop: 8,
        paddingHorizontal: 16,

    },
    lockCarTip: {
        color: '#8D8E99',
        fontSize: 12,
        paddingBottom: 8,
    },
    lockCarView: {
        backgroundColor: '#FF571A',
        borderRadius: 20,
        width: 343,
        paddingVertical: 12,
    },
    lockCarText: {
        color: '#fff',
        fontSize: 16,
        alignSelf: 'center',
    },
    lockedTips: {
        paddingHorizontal: 16,
        paddingVertical: 15,
        backgroundColor: '#FFF2BD',
        flexDirection: 'row',
    },
    lockedTipsText: {
        color: '#FF571A',
        fontSize: 14,
    },
    carModelStyle: {
        paddingLeft: 16,
        paddingTop:15,
        paddingBottom:16,
        backgroundColor: Color.White1,
        marginBottom: 12,
    },
    carModelNameStyle: {
        color: '#1B1C33',
        fontSize: 18,
        fontWeight: 'bold',
    },
    colorStyle: {
        fontSize: 12,
        color: '#5E5E66',
        marginTop: 11,
    },
    priceView:{
        flexDirection: 'row',
        marginTop: 11,
    },
    priceStyle: {
        color: '#5E5E66',
        fontSize: 12,
        marginRight: 12,
    },
    tagStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    tagView: {
        height: 16,
        justifyContent: 'center',
        paddingHorizontal: 6,
        borderRadius: 2,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 2,
        marginBottom:2
    },
    tagText: {
        fontSize: 10,
        color: theme('color_text_body'),
        fontWeight: 'bold'
    },
    overdueInventoryView: {
        backgroundColor: '#FF571A1A',
    },
    overdueInventoryText: {
        color: theme('color_primary_text'),
    },
    vinStyle: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#D9D9D9',
        marginTop: 18,
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    vinText: {
        flex: 1,
        fontSize: 14,
        color: theme('color_text_body'),
        alignSelf: 'center'
    },
    vinNum: {
        flex: 3,
        fontSize: 14,
        color: theme('color_text_title'),
        alignSelf: 'center',
        textAlign: 'right',
        marginRight: 21,
    },
    vinNumNone:{
        textAlign: 'left',
    },
    copyView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 16,
    },
    copy: {
        width: 48,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#D9D9D9',
        borderRadius: 12,
        paddingVertical: 6,
    },
    copyText: {
        fontSize: 12,
        alignSelf: 'center',
        color: theme('color_text_title'),
    },
    InfoStyle: {
        paddingBottom: 14,
        paddingTop: 16,
        paddingRight: 16,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#D9D9D9',
    },
    lastStyle:{
        borderBottomColor: '#fff',
    },
    infoTitle: {
        color: theme('color_text_title'),
        fontSize: 18,
        marginBottom: 30,
        fontWeight: 'bold',
    },
    infoView: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoViewTitle: {
        flex: 4,
        color: theme('color_text_body'),
        fontSize: 14,
        lineHeight: 18,
    },
    infoViewText: {
        flex: 8,
        color: theme('color_text_title'),
        fontSize: 14,
        lineHeight: 18
    },
    interestholiday: {
        color: theme('color_text_selected'),
    },
    orderInfo: {
        flexDirection:'row',
        marginBottom: 29,
    },
    orderTitle:{
        flex: 1,
        justifyContent:'center',
    },
    orderTitleText:{
        color: theme('color_text_title'),
        fontSize: 18,
        fontWeight: 'bold'
    },
    checkMore: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    freeDate:{
        color:theme('color_text_title')
    },
    overDate:{
        color:'#FF4040'
    }
})

export default stylesExample