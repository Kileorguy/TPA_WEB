package model

type GroupRequest struct {
	ID      string `json:"id"`
	GroupID string `json:"groupID"`
	UserID  string `json:"userID"`
	User    *User  `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
}
