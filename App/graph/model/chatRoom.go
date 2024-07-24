package model

type ChatRoom struct {
	ID      string `json:"id"`
	User1ID string `json:"user1ID"`
	User2ID string `json:"user2ID"`
	User1   User   `json:"user1" gorm:"foreignKey:User1ID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	User2   User   `json:"user2" gorm:"foreignKey:User2ID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
}

type CreateChatRoom struct {
	UserID  string `json:"userID"`
	User2id string `json:"user2ID"`
}
