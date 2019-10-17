import { NativeModules } from 'react-native';

export default {
    vars: {
        // 自定义通用主题
        common: {
            color_primary: '#ed6234',
            color_opacity:'#fcefe9'
        },
        // 自定义车新零售主题
        singleunit: {
            color_primary: '#ed6234',
            color_opacity:'#fcefe9'
        },
    },
    getAppName: function() {
        // 这个函数的返回值决定使用哪个 APP 的主题
        return  NativeModules.SCCRNAppData &&
                NativeModules.SCCRNAppData.appName &&
                NativeModules.SCCRNAppData.appName.toLowerCase();
    },
};