package helper

import (
	"fmt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"log"
	"os"
)

func GoDotEnvLoader(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(".env error")
	}
	return os.Getenv(key)
}
func HashAndSalt(pw string) string {
	pwByte := []byte(pw)
	hash, err := bcrypt.GenerateFromPassword(pwByte, bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err)
	}
	return string(hash)
}

func ValidateSaltPassword(pw string, hashedPw string) bool {
	pwd := []byte(pw)
	hashed := []byte(hashedPw)
	err := bcrypt.CompareHashAndPassword(hashed, pwd)
	if err != nil {
		fmt.Println("Error hash", err)
		return false
	}
	return true
}
