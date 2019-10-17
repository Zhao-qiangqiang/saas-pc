import {
    SRNStore,
    observable,
    action,
    SRNConfig,
} from '@souche-f2e/srn-framework';
import BLKSRNFetch from '../shared/utils/fetch'

import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';

//配置查询接口
const APIConfig = {
    //查询品牌车辆
    GetThrSeriesCatalogByOrg: `${SRNConfig.pangolin}/pangolinEntrance/getThrSeriesCatalogByOrg.json`,
};

class CarSelectModelStore extends SRNStore {
    constructor() {
        super();
    }
    //查询品牌是否为一个，如果为一个，需要直接定位到具体品牌
    @observable 
    carBrandList = []
    
    //选中车型
    @observable 
    carSelectList = []//筛选默认选中数据

    @action
    carSelectListChange(data){
        this.carSelectList = data
    }
    //根据品牌/车系查询车型数据
    @action
    GetThrSeriesCatalogByOrg(data) {
        return BLKSRNFetch(APIConfig.GetThrSeriesCatalogByOrg, {
            method: 'GET',
            data: data
        }).then(res => {
            let list = []
            if (data.type == '3') {
                list = res.map(item => (
                    {
                        code: item.modelCode,
                        name: item.modelName,
                    }
                ))
            }
            this.carBrandList = res || []
            return list

        }).catch((error) => {
            console.log(error)
        });
    }

}



export default CarSelectModelStore;