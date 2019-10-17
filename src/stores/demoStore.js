/**
 * 此处定义页面数据管理层，业务复杂请分文件夹
 */

import {
    SRNStore,
    observable,
    action,
    computed
} from '@souche-f2e/srn-framework';

class DemoStore extends SRNStore {
    @observable carModelData = []

    constructor() {
        super();
    }

    @action selectCarModel(dataArr) {
        console.log('车型信息----->', dataArr);
        if (Array.isArray(dataArr)) {
            this.carModelData = [...dataArr];
        }
    }

    @computed get carModelName() {
        // 所有级拼起来的name
        /* const carModelData = this.carModelData.reduce((carModelName, item) => {
            carModelName += item.name ? `${item.name} ` : '';
            return carModelName;
        }, ''); */
        // 只取最后一级的name
        const len = this.carModelData.length;
        const carModelData = this.carModelData || [];
        const carModelName = carModelData[len - 1]
            ? carModelData[len - 1].name
            : '';
        return carModelName;
    }
}

export default DemoStore;
