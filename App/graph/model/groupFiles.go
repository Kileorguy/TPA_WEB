package model

import "time"

type GroupFiles struct {
	ID       string    `json:"id"`
	GroupID  string    `json:"groupID"`
	Group    *Group    `json:"group" gorm:"foreignKey:GroupID ; references:ID ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID   string    `json:"userID"`
	FileName string    `json:"fileName"`
	User     *User     `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	Time     time.Time `json:"time"`
	Link     string    `json:"link"`
}
