package model

type PostFile struct {
	ID     string `json:"id"`
	PostID string `json:"postID"`
	Post   *Post  `json:"post" gorm:"foreignKey:PostID ; references:ID ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	File   string `json:"file"`
}
