const sql = require('../sql');

class userinfo {
  //  根据openid 或者 id 获取用户信息
  getUserInfo({ openid, id }) {
    const sqlstr = `SELECT * FROM wx_users WHERE ${openid ? 'openid' : 'id'} = ?`;
    return new Promise((resolve, reject) => {
      sql.query(sqlstr, openid || id || 0, (error, res) => {
        if (error) {
          reject(error);
        } else {
          const data = res[0];
          if (data) {
            resolve(data);
          } else {
            reject('没有找到用户');
          }
        }
      });
    });
  }
  //  插入用户信息，返回用户id
  insertUserInfo(data) {
    const form = {
      openid: data.openid,
      unionid: data.unionid,
      nick_name: data.nickName,
      gender: data.gender,
      city: data.city,
      province: data.province,
      country: data.country,
      avatar_url: data.avatarUrl,
      update_time: new Date(),
    };
    return new Promise((resolve, reject) => {
      sql.query('INSERT INTO wx_users SET ?', form, (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res.insertId);
        }
      });
    });
  }
}

module.exports = new userinfo();
