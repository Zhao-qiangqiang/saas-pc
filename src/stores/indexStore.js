/**
 * 此处定义页面数据管理层，业务复杂请分文件夹
 */

import { SRNStore, observable, action } from '@souche-f2e/srn-framework';
import CarModel from '../models/CarModel';

// [SRNStore 数据管理] http://fedoc.sqaproxy.souche.com/#/rn/framework/framework_SRNStore
class IndexStore extends SRNStore {
    @observable recommendCar = new CarModel();

    constructor () {
        super();
    }

    /**
     * 请求数据
     */
    @action
    fetch () {
        // 调用父类的方法发起请求
        this.__fetch('http://niu.souche.com/car/E3mzQRagdT').then((data) => {
            this.recommendCar = this.recommendCar.__mapping(data.data);
        }).catch((e) => {
            // 请求失败，e.message 是后台返回的message，e.code 是后台返回的错误码
        });
    }
}

export default IndexStore;
