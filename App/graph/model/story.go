package model

import "time"

type Story struct {
	ID              string    `json:"id"`
	Text            string    `json:"text"`
	UserID          string    `json:"userID"`
	User            *User     `json:"user" gorm:"foreignKey:UserID ; references:Email ; constraint:OnUpdate:CASCADE , onDelete:CASCADE"`
	TextColor       string    `json:"textColor"`
	BackgroundColor string    `json:"backgroundColor"`
	Link            string    `json:"link"`
	CreatedAt       time.Time `json:"CreatedAt"`
}

type NewPhotoStory struct {
	Link string `json:"link"`
}

type NewTextStory struct {
	Text            string `json:"text"`
	TextColor       string `json:"textColor"`
	BackgroundColor string `json:"backgroundColor"`
}
