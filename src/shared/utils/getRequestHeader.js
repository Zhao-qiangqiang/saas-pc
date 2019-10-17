import { Base64 } from 'js-base64';

const sha1 = require('sha1');
const appSecret = '8DE3AF3454976A2C2B1D692A46DFBD3B'; // 目前写死
const appKey = 'e594d7b0-3e17-416e-92a0-5ba49b5a0f7e';
const requestHeaderUtils = {
    jointParams(params) {
        let str = '';
        const rankedKeyArr = Object.keys(params).sort();

        for (const i in rankedKeyArr) {
            if (rankedKeyArr[i]) {
                const tmpStr = `${rankedKeyArr[i]}=${params[rankedKeyArr[i]]}`;
                const jointMark = i < rankedKeyArr.length - 1 ? '&' : '';
                str += tmpStr + jointMark;
            }
        }
        return str;
    },
    encryptByBase64(str) {
        if (typeof str === 'string') {
            return Base64.encode(str);
        }

        throw new Error('base64加密传参数错误');
    },
    encryptBySha1(str) {
        if (typeof str === 'string') {
            const sign = `${appSecret}:${str}`;
            return sha1(sign);
        }

        throw new Error('SHA1加密传参数错误');
    },
    compose(...funcs) {
        if (funcs.length === 0) {
            return arg => arg;
        }

        if (funcs.length === 1) {
            return funcs[0];
        }

        return funcs.reduce((a, b) => (...args) => a(b(...args)));
    },
    getSign(data) {
        return this.compose(
            this.encryptBySha1,
            this.encryptByBase64,
            this.jointParams
        )(data);
    }
};

function getRequestHeader(options, headerUpdate = true) {
    const { headers = {}, data = {}, json = {}, method } = options;
    const timeStamp = String(new Date().getTime());
    try {
        const newHeader = {
            ...headers,
            'App-Key': appKey, // 目前先写死
            Timestamp: timeStamp,
            'x-izayoi-sign':
                method === 'GET'
                    ? requestHeaderUtils.getSign(data)
                    : requestHeaderUtils.getSign(json)
        };

        return headerUpdate ? newHeader : headers;
    } catch (e) {
        throw new Error(e);
    }
}

export default getRequestHeader;
