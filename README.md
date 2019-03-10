# haohaodo-api

用于获取电影信息的接口，调用豆瓣的接口

### /sql/index.js 要配置自己的 mysql 参数，如下所示

```

const mysql = require('mysql');

module.exports = mysql.createConnection({
  host: '', # 数据库地址
  user: '', # 用户名
  password: '', # 密码
  port: '3306', # 端口，一般是3306
  database: '', # 数据库
  dateStrings: 'DATETIME',  # 避免时区问题
});
```
