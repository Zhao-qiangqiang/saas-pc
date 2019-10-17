import {
    SRNModel,
    Unit,
    UnitType,
    Check,
    CheckType,
    ServerName,
    observable,
} from '@souche-f2e/srn-framework';

class CarModel extends SRNModel {
    /**
     * 价格
     * @type {number}
     */
    @observable
    @Check(CheckType.Number)
    @Unit(UnitType.PRICE_UNIT_WY)
    price = 0;

    /**
     * 里程
     * @type {number}
     */
    @observable
    @Check(CheckType.Number)
    @Unit(UnitType.MILEAGE_UNIT_KM)
    mileage = 0;

    /**
     * 标题
     * @type {string}
     */
    @observable
    @Check(CheckType.String)
    @ServerName('model')
    title = '';

    /**
     * 卖家名
     * @type {string}
     */
    @observable
    @Check(CheckType.String)
    @ServerName('seller_name')
    sellerName = '';
}

export default  CarModel;