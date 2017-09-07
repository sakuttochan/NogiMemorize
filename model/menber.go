package model

import (
	"time"
	"github.com/jmoiron/sqlx"
)

type Member struct {
	ID         int64      `db:"member_id" json:"id"`
	Name       string     `json:"name"`
	Height     int64       `json:"height"`
	Birthday   int64       `json:"birthday"`
	PictureUrl string      `json:"pictureUrl"`
	Created    *time.Time `json:"created"`
	Updated    *time.Time `json:"updated"`
}

func GetMemberById(dbx *sqlx.DB, id int64) (*Member, error) {
	var member Member
	if err := dbx.Get(&member, `
    select * from members where member_id = ?
	`, id); err != nil {
		return nil, err
	}
	return &member, nil
}
