const axios = require('axios');

/**
 * 流向登录接口，验证code
 */

const api = axios.create({
  baseURL: 'http://fmp.quanyaowang.com:8080/keyAPI.aspx',
});

const checkCode = (key) =>
  api.get('/', {
    params: {
      key,
    },
  });

module.exports = checkCode;
