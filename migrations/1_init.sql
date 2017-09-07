-- +migrate Up
CREATE TABLE `members` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(256) NOT NULL COMMENT 'タスクのタイトル',
  `birthday` int(11) NOT NULL DEFAULT FALSE COMMENT 'タスクが完了したか否か',
  `height` int(11) NOT NULL COMMENT '身長',
  `created` datetime NOT NULL DEFAULT NOW() COMMENT '登録日',
  `updated` datetime DEFAULT NULL COMMENT '更新日',
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='乃木坂メンバーリスト';

-- +migrate Down
DROP TABLE members;
