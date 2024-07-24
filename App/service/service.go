package service

import (
	"github.com/Kileorguy/database"
	"github.com/Kileorguy/graph/model"
	"gorm.io/gorm"
)

var db *gorm.DB = database.GetInstance()

func GetUserbyEmail(email string) (*model.User, error) {
	var user *model.User

	return user, db.First(&user, "email = ?", email).Error
}
