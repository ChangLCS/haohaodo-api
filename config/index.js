const responseSuccess = {
    code: 0,
    status: 200,
    message: 'ok',
  },
  responseError = {
    code: 404,
    status: 200,
    message: 'Not Found',
  };

//  设置回调成功的结果
const setResponseSuccess = (ret, message) =>
  Object.assign(
    {},
    responseSuccess,
    { result: ret },
    { message: message || responseSuccess.message },
  );

//  设置回调失败的结果
const setResponseError = (message, code) =>
  Object.assign({}, responseError, {
    message: message || responseError.message,
    code: code || responseError.code,
  });

//  省
const provinceList = [
  '广东',
  '黑龙江',
  '北京',
  '天津',
  '上海',
  '重庆',
  '河北',
  '山西',
  '辽宁',
  '吉林',
  '江苏',
  '浙江',
  '安徽',
  '福建',
  '江西',
  '山东',
  '河南',
  '湖北',
  '湖南',
  '海南',
  '四川',
  '贵州',
  '云南',
  '陕西',
  '甘肃',
  '青海',
  '台湾',
  '内蒙古',
  '广西',
  '西藏',
  '宁夏',
  '新疆',
  '香港',
  '澳门',
];

//  是否省份
const isProvince = (name = '') => Boolean(provinceList.indexOf(name) > -1);

module.exports = {
  setResponseSuccess,
  setResponseError,
  resourceList: ['深圳', '东莞', '肇庆'],
  isProvince,
};
