package model

type Notification struct {
	ID     string `json:"id"`
	UserID string `json:"userID"`
	User   *User  `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	Text   string `json:"text"`
}
