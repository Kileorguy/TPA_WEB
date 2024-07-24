package model

type Comment struct {
	ID        string   `json:"id"`
	PostID    string   `json:"postID"`
	Post      *Post    `json:"post" gorm:"foreignKey:PostID ; references:id ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID    string   `json:"userID"`
	User      *User    `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	Text      string   `json:"text"`
	Reply     []*Reply `json:"reply" gorm:"-"`
	LikeCount int      `json:"likeCount" gorm:"-"`
}

type CommentInput struct {
	PostID string `json:"postID"`
	UserID string `json:"userID"`
	Text   string `json:"text"`
}

type RComment struct {
	ReelsID string `json:"reelsID"`
	Text    string `json:"text"`
}

type ReelsComments struct {
	ID        string   `json:"id"`
	ReelsID   string   `json:"reelsID"`
	Reel      *Reels   `json:"reel" gorm:"foreignKey:ReelsID ; references:id ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	UserID    string   `json:"userID"`
	User      *User    `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	Text      string   `json:"text"`
	Reply     []*Reply `json:"reply" gorm:"-"`
	LikeCount int      `json:"likeCount" gorm:"-"`
}
