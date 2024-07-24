// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)


type NewUser struct {
	FirstName string    `json:"firstName"`
	Surname   string    `json:"surname"`
	Email     string    `json:"email" gorm:"unique"`
	Password  string    `json:"password"`
	Dob       time.Time `json:"DOB"`
	Gender    string    `json:"gender"`
	Role      string    `json:"role"`
}



type User struct {
	ID             string    `json:"id"`
	FirstName      string    `json:"firstName"`
	Surname        string    `json:"surname"`
	Email          string    `json:"email" gorm:"unique"`
	Password       string    `json:"password"`
	Dob            time.Time `json:"DOB"`
	Gender         string    `json:"gender"`
	Role           string    `json:"role"`
	ProfilePicture string    `json:"profilePicture"`
	Active         bool      `json:"active"`
}
