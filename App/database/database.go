package database

import (
	"github.com/Kileorguy/graph/model"
	"github.com/Kileorguy/helper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var def = "host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"
var database *gorm.DB

func GetInstance() *gorm.DB {
	if database == nil {
		dsn := helper.GoDotEnvLoader("URL")
		if dsn == "" {
			dsn = def
		}
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			panic("Database Error")
		}
		database = db
	}
	return database
}

func Migrate() {
	db := GetInstance()
	db.AutoMigrate(&model.User{}, &model.Post{}, &model.Friends{}, &model.Reels{}, &model.PostLike{}, &model.ReelsLike{}, &model.Comment{},
		&model.Reply{}, &model.ChatRoom{}, &model.PostFile{}, &model.ReelsComments{}, &model.Notification{},
		&model.Group{}, &model.GroupMember{}, &model.GroupRequest{}, &model.GroupFiles{}, &model.Story{})
}
