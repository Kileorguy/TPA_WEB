package model

type Reply struct {
	ID        string   `json:"id"`
	CommentID string   `json:"commentID"`
	Comment   *Comment `json:"comment" gorm:"foreignKey:CommentID ; references:ID ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID    string   `json:"userID"`
	User      *User    `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	Text      string   `json:"text"`
	LikeCount int      `json:"likeCount"`
}

type ReplyInput struct {
	CommentID string `json:"commentID"`
	Text      string `json:"text"`
}
