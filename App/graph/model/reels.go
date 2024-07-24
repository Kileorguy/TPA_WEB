package model

type Reels struct {
	ID           string           `json:"ID"`
	User         *User            `json:"User" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID       string           `json:"UserID" gorm:"unique"`
	Link         string           `json:"Link"`
	LikeCount    int              `json:"likeCount" gorm:"-"`
	Text         string           `json:"text"`
	Comments     *[]ReelsComments `json:"comments" gorm:"-"`
	CommentCount int              `json:"commentCount" gorm:"-"`
}
