package model

type GroupMember struct {
	ID      string `json:"id"`
	GroupID string `json:"groupID"`
	Group   *Group `json:"group" gorm:"foreignKey:GroupID ; references:ID ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID  string `json:"userID"`
	User    *User  `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	IsAdmin bool   `json:"isAdmin"`
}

type InputGroupMember struct {
	GroupID string `json:"groupID"`
	UserID  string `json:"userID"`
	IsAdmin bool   `json:"isAdmin"`
}
