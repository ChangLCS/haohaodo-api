# haohaodo-api

用于获取电影信息的接口，调用豆瓣的接口

### /sql/index.js 要配置自己的 mysql 参数，如下所示

```

const mysql = require('mysql');

//  以连接池的方式连接mysql
module.exports = mysql.createPool({
  host: '', // 数据库地址
  user: '', // 用户名
  password: '', // 密码
  port: '3306', // 端口，一般是3306
  database: '', // 数据库
  dateStrings: 'DATETIME',  // 避免时区问题
});
```

### /wechat/config.js 配置公众号参数

```
module.exports = {
  appID: '', //  公众号里取
  appSecret: '', //  公众号里取
  token: '', //  自定义token
  EncodingAESKey: '', //  微信消息加密密钥

  programID: '', //  小程序appid
  programSecret: '', //小程序appSecret
};
```
