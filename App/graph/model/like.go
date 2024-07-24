package model

type PostLike struct {
	PostID string `json:"PostID" gorm:"primaryKey"`
	Post   *Post  `json:"post" gorm:"foreignKey:PostID ; references:ID ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID string `json:"UserID" gorm:"primaryKey"`
	User   User   `json:"User" gorm:"primaryKey; foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
}

type ReelsLike struct {
	ReelsID string `json:"ReelsID" gorm:"primaryKey"`
	Reels   *Reels `json:"reels" gorm:"foreignKey:ReelsID ; references:ID ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID  string `json:"UserID" gorm:"primaryKey"`
	User    User   `json:"User" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
}
