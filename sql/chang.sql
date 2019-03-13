USE chang;


create table douban_movie
(
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  d_id INT(11) DEFAULT NULL COMMENT '豆瓣id',
  title VARCHAR(255) DEFAULT NULL COMMENT '名称',
  original_title VARCHAR(255) DEFAULT NULL COMMENT '原名',
  aka TEXT DEFAULT NULL COMMENT '别称',
  countries VARCHAR(255) DEFAULT NULL COMMENT '国家',
  years INT(11) DEFAULT NULL COMMENT '年份',
  summary TEXT DEFAULT NULL COMMENT '描述',
  rating VARCHAR(255) DEFAULT NULL COMMENT '评分',
  images VARCHAR(255) DEFAULT NULL COMMENT '海报',
  casts VARCHAR(255) DEFAULT NULL COMMENT '演员',
  directors VARCHAR(255) DEFAULT NULL COMMENT '导演',
  genres VARCHAR(255) DEFAULT NULL COMMENT '标签',
  update_time datetime DEFAULT NULL COMMENT '更新时间',
)

create table douban_people
(
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  d_id INT(11) DEFAULT NULL COMMENT '豆瓣id',
  name VARCHAR(255) DEFAULT NULL COMMENT '名称',
  images VARCHAR(255) DEFAULT NULL COMMENT '照片',
  type INT(11) DEFAULT NULL COMMENT '类型：1 导演，2 演员',
  update_time datetime DEFAULT NULL COMMENT '更新时间',
)

CREATE TABLE wx_users (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  openid varchar(255) DEFAULT NULL,
  unionid varchar(255) DEFAULT NULL,
  nick_name varchar(255) DEFAULT NULL,
  gender int(11) DEFAULT NULL COMMENT '1 男 2 女',
  city varchar(255) DEFAULT NULL,
  province varchar(255) DEFAULT NULL,
  country varchar(255) DEFAULT NULL,
  avatar_url text DEFAULT NULL,
  update_time datetime DEFAULT NULL COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create TABLE wx_orders (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  createId INT(11) DEFAULT NULL,
  createTime DATETIME DEFAULT NULL,
  phone VARCHAR(255) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  remarks VARCHAR(255) DEFAULT NULL,
  amount DECIMAL(18,2) DEFAULT NULL,
  acceptId INT(11) DEFAULT NULL,
  acceptTime DATETIME DEFAULT NULL,
  status INT(11) DEFAULT 0 COMMENT '0 待接单，1 已接单，2 已完成，3 已取消'
)

-- Select rows from a Table or View 'TableOrViewName' in schema 'SchemaName'
SELECT o.*,u.nickName FROM weixin.wx_orders o left JOIN weixin.wx_users u ON o.createId = u.id
WHERE o.status = 0 and o.createId = 3;
