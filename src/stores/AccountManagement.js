import {
  SRNStore,
  observable,
  action,
  SRNConfig,
  computed
} from '@souche-f2e/srn-framework';
import BLKSRNFetch from '../shared/utils/fetch';

import SRNNative from '@souche-f2e/srn-native';
var Buffer = require('buffer').Buffer;
// 配置查询接口;
const APIConfig = {
  //查询当前门店开通的业务状态
  listShopBusinessStatus: `${
    SRNConfig.accountlin
  }/shopBusinessJson/listShopBusinessStatus.json`,
  //账号绑定
  bindingAccount: `${SRNConfig.accountlin}/rpaAccountMappingJson/bindingAccount.json`,
  //解除账号绑定
  deBindingAccount: `${SRNConfig.accountlin}/rpaAccountMappingJson/deBindingAccount.json`,
  // 更新账号
  updateAccount: `${SRNConfig.accountlin}/rpaAccountMappingJson/updateAccount.json`,
  //查询账号
  getRpaAccountMapping: `${
    SRNConfig.accountlin
  }/rpaAccountMappingJson/getRpaAccountMapping.json`
};

class AccountManagement extends SRNStore {
  @observable status = '1'; //判断显示那个弹框
  @observable title = '账号绑定'; //弹框标题
  @observable password = ''; //密码
  @observable account = ''; //账号
  @observable accountList = []; //账号列表
  @observable deleteObj = {
    rpaAccountMappingId: ''
  }; //删除账号入参
  @observable bindingBusinessVO = {
    password: '', //密码,
    id: '',
    systemName: '', //系统名称,
    systemCode: '', //系统编码,
    account: '' //账号
  };
  @observable getAccountObj = {
    //更新查询
    rpaAccountMappingId: ''
  };
  @observable updataBindingBusinessVO = {
    password: '', //密码,
    id: '',
    systemName: '', //系统名称,
    systemCode: '', //系统编码,
    account: '' //账号
  };

  @action
  getAccountList() {
    //查询账号列表
    return BLKSRNFetch(APIConfig.listShopBusinessStatus, {
      method: 'GET',
      data: {}
    })
      .then(res => {
        console.log(res, res);
        res.forEach((item, index) => {
          if (item.statusCode === '35600000') {
            item.buttonText = '去绑定';
          } else if (item.statusCode === '35600005') {
            item.buttonText = '解绑';
          } else if (item.statusCode === '35600010') {
            item.buttonText = '更新';
          }
        });
        this.accountList = res;
        return 'success';
      })
      .catch(error => {
        console.log(error, error);
        SRNNative.confirm({
          title: '提示',
          text: '加载失败',
          rightButton: '确认'
        });

        return 'error';
      });
  }
  @action
  deleteAccount(deleteObj) {
    //账号解绑
    return BLKSRNFetch(APIConfig.deBindingAccount, {
      method: 'GET',
      data: deleteObj
    })
      .then(res => {
        return res;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: error.msg,
          rightButton: '确认'
        });
        return false;
      });
  }
  @action
  bindAccount(bindingBusinessVO) {
    return BLKSRNFetch(APIConfig.bindingAccount, {
      method: 'POST',
      json: bindingBusinessVO
    })
      .then(res => {
        return res;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: '绑定失败',
          rightButton: '确认'
        });
        return false;
      });
  }
  @action
  rpaAccountMappingIdChange(value) {
    this.deleteObj.rpaAccountMappingId = value;
  }
  @action
  assignAccount(value) {
    this.bindingBusinessVO.account = value;
  }
  @action
  assignPassWord(value) {
    this.bindingBusinessVO.password = value;
  }
  @action
  assignAddOther(id, systemName, systemCode) {
    this.bindingBusinessVO.id = id;
    this.bindingBusinessVO.systemName = systemName;
    this.bindingBusinessVO.systemCode = systemCode;
  }
  @action
  clearInterval() {
    this.bindingBusinessVO.id = '';
    this.bindingBusinessVO.systemName = '';
    this.bindingBusinessVO.systemCode = '';
    this.bindingBusinessVO.password = '';
    this.bindingBusinessVO.account = '';
  }
  @action
  getAccount(getAccountObj) {
    //更新获取账号
    return BLKSRNFetch(APIConfig.getRpaAccountMapping, {
      method: 'GET',
      data: getAccountObj
    })
      .then(res => {
        this.updataBindingBusinessVO.password = new Buffer(
          res.password,
          'base64'
        ).toString();
        this.updataBindingBusinessVO.id = res.id;
        this.updataBindingBusinessVO.systemName = res.systemName;
        this.updataBindingBusinessVO.systemCode = res.systemCode;
        this.updataBindingBusinessVO.account = new Buffer(
          res.account,
          'base64'
        ).toString();
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: '查询失败',
          rightButton: '确认'
        });
      });
  }
  @action
  updataChange(value) {
    this.getAccountObj.rpaAccountMappingId = value;
  }
  @action
  assignUpdataAccount(value) {
    this.updataBindingBusinessVO.account = value;
  }
  @action
  assignUpdataPassWord(value) {
    this.updataBindingBusinessVO.password = value;
  }
  @action
  updateAccount(updataBindingBusinessVO) {
    return BLKSRNFetch(APIConfig.updateAccount, {
      method: 'POST',
      json: updataBindingBusinessVO
    })
      .then(res => {
        return res;
      })
      .catch(error => {
        SRNNative.confirm({
          title: '提示',
          text: '更新失败',
          rightButton: '确认'
        });
        return 'error';
      });
  }
}
export default AccountManagement;
