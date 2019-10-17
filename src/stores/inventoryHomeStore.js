import {
    SRNStore,
    observable,
    action,
    SRNConfig,
    computed
} from '@souche-f2e/srn-framework';
import BLKSRNFetch from '../shared/utils/fetch'

import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';

//配置查询接口
const APIConfig = {
    //获取角色列表
    GetAuthRoles: `${SRNConfig.pangolin}/pangolinEntrance/getAuthRoles.json`,
};

class inventoryHomeStore extends SRNStore {
    
    //获取角色列表
    @action getAuthRoles(data) {
        SRNNative.Loading.show();
        return BLKSRNFetch(APIConfig.GetAuthRoles, {
            method: 'POST',
            json: data
        }).then(res => {
            SRNNative.Loading.hide();
            return res
        }).catch((error) => {
            SRNNative.Loading.hide();
           console.log(error)
        });
    }

}



export default inventoryHomeStore;