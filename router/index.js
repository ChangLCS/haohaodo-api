const router = require('koa-router')();

//  获取token
const loginGetToken = require('../login/getToken');

//  其它方法
const getOrderAmount = require('../controller/getOrderAmount');
const getCharts = require('../controller/getCharts');
const getOrderList = require('../controller/getOrderList');
const getOrderCity = require('../controller/getOrderCity');
const getCount = require('../controller/getCount');
const getPurchase = require('../controller/getPurchase');
const getScreenAmount = require('../controller/getScreenAmount');
const getScreenYear = require('../controller/getScreenYear');
const getScreenYearAll = require('../controller/getScreenYearAll'); //  年交易额占比
const getScreenTotal = require('../controller/getScreenTotal');
const getScreenStock = require('../controller/getScreenStock');
const getScreenTimeLine = require('../controller/getScreenTimeLine');

//  --	医院累计成交  --  品种累计销售  --  配送商累计成交
const getScreenTopHospital = require('../controller/getScreenTopHospital');
const getScreenTopDrug = require('../controller/getScreenTopDrug');
const getScreenTopSend = require('../controller/getScreenTopSend');

const getPriceDrug = require('../controller/getPriceDrug');

const sendEmail = require('../controller/sendEmail');

const path = {
  loginGetToken: '/login/get/token',

  getOrderAmount: '/get/order/amount',
  getCharts: '/get/charts',
  getOrderList: '/get/order/list',
  getOrderCity: '/get/order/city',
  getCount: '/get/count',
  getPurchase: '/get/purchase',
  getScreenAmount: '/get/screen/amount',
  getScreenYear: '/get/screen/year',
  getScreenYearAll: '/get/screen/year/all',
  getScreenTotal: '/get/screen/total',
  getScreenStock: '/get/screen/stock',
  getScreenTimeLine: '/get/screen/time/line',

  getScreenTopHospital: '/get/screen/top/hospital',
  getScreenTopDrug: '/get/screen/top/drug',
  getScreenTopSend: '/get/screen/top/send',

  getPriceDrug: '/get/price/drug',

  sendEmail: '/sendEmail',
};

router.get(path.loginGetToken, loginGetToken.run);

router.get(path.getOrderAmount, getOrderAmount.run);
router.get(path.getCharts, getCharts.run);
router.get(path.getOrderList, getOrderList.run);
router.get(path.getOrderCity, getOrderCity.run);
router.get(path.getCount, getCount.run);
router.get(path.getPurchase, getPurchase.run);
router.get(path.getScreenAmount, getScreenAmount.run);
router.get(path.getScreenYear, getScreenYear.run);
router.get(path.getScreenYearAll, getScreenYearAll.run);
router.get(path.getScreenTotal, getScreenTotal.run);
router.get(path.getScreenStock, getScreenStock.run);
router.get(path.getScreenTimeLine, getScreenTimeLine.run);

router.get(path.getScreenTopHospital, getScreenTopHospital.run);
router.get(path.getScreenTopDrug, getScreenTopDrug.run);
router.get(path.getScreenTopSend, getScreenTopSend.run);

router.get(path.getPriceDrug, getPriceDrug.run);

router.post(path.sendEmail, sendEmail.run);

module.exports = {
  router,
  noTokenPath: [path.loginGetToken],
};
