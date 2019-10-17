/**
 * [组件的基本构成] http://fedoc.sqaproxy.souche.com/rn/develop/dev_1.html
 */
import React, {Component} from 'react';
import { List } from '@souche-ui/srn-ui';
import { observer } from '@souche-f2e/srn-framework';

@observer
class CarItemView extends Component {
    constructor() {
        super();
    }
    render() {
        const {carData} = this.props;
        return (
            <List title="车辆信息">
                <List.Item title="品牌车型" extra={carData.carModelName} />
            </List>
        );
    }
}


export default CarItemView;
