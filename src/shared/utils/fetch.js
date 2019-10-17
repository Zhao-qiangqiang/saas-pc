import { SRNFetch } from '@souche-f2e/srn-framework';
import getRequestHeader from './getRequestHeader';

const BLKSRNFetchUtils = {
  checkUrl(url) {
    const urlRegex = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    return urlRegex.test(url);
  }
};

const authInfo = {
  // orgId: '85fcbd70ea3f43f48b9a0dbf95090fb9', // 先写死srp
  // orgId:'592',//erp
  // appId: 'pangolin003', // 先写死
  // tentantId: '5253a1f2a7be452fbaafa9c33aad9cf5' // 先写死srp
  //tentantId:'pangolin20181226',//erp
  //
};

/**
 * @description 基于SRNFetch的二次封装，主要封装了
 *              1.对于格式错误的url抛出异常
 *              2.格式化headers，主要是增加App-Key,Timestamp,x-izayoi-sign
 * @param {string} url
 * @param {object} httpOptions  包含headers,data,method,timeout..., 具体的模型没有找到...
 * @param {object} otherOptions 其他配置：
 *                              1. headerUpdate:是否要在请求头里增加App-Key,Timestamp,x-izayoi-sign
 * @return {fuction} SRNFetch
 */

function BLKSRNFetch(url, httpOptions, otherOptions) {
    if (!httpOptions.headers) {
        httpOptions.headers = {};
    }

  if (!httpOptions.data) {
    httpOptions.data = {};
  }

  if (!BLKSRNFetchUtils.checkUrl(url)) {
    throw new Error('url格式错误');
  }

  const { headerUpdate = true } = otherOptions || {};
  const { method } = httpOptions;
  if (method) {
    switch (method) {
      case 'POST':
        httpOptions.json = Object.assign({}, httpOptions.json, authInfo);
        break;
      case 'GET':
        httpOptions.data = Object.assign({}, httpOptions.data, authInfo);
        break;
      default:
        throw new Error('http请求方法错误');
    }

    httpOptions.headers = Object.assign(
      httpOptions.headers,
      getRequestHeader(httpOptions, headerUpdate)
    );

    return SRNFetch(url, httpOptions);
  } else {
    throw new Error('http请求方法不能为空');
  }
}

export default BLKSRNFetch;
