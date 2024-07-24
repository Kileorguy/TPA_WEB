package model

type Group struct {
	ID      string         `json:"id"`
	Title   string         `json:"title"`
	Member  []*GroupMember `json:"-"`
	Admin   []*GroupMember `json:"-"`
	Privacy string         `json:"privacy"`
}
