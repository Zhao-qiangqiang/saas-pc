import {
    SRNModel,
    Unit,
    UnitType,
    Check,
    CheckType,
    ServerName,
    observable,
} from '@souche-f2e/srn-framework';

class InventorySharingModel extends SRNModel {
    /**
     * 品牌
     * @type {String}
     */
    

    /**
     * 车型
     * @type {String}
     */
    @observable
    @Check(CheckType.String)
    carModelName = '';

    /**
     * 车型id
     * @type {String}
     */
    @observable
    @Check(CheckType.String)
    carModelId = '';

    /**
     * 车系id
     * @type {string}
     */
    @observable
    @Check(CheckType.String)
    carSeriesId = '';

    /**
     * 车身色
     * @type {string}
     */
    @observable
    @Check(CheckType.String)
    carColorName = '';
    
    // 内饰色
    @observable
    @Check(CheckType.String)
    carInnerColorName = '';
    
    //经销商
    @observable
    @Check(CheckType.String)
    orgId = '';
    
}

export default InventorySharingModel;