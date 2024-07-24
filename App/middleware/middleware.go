package middleware

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"net/http"
	"time"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		log.Printf("Token {%s}", token)
		if token != "" {
			ctx := context.WithValue(r.Context(), "token", token)
			r = r.WithContext(ctx)
		}
		next.ServeHTTP(w, r)

	})
}

const secret_key = "DK23-1DK23-1DK23-1"

func JWT_encrypt(email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": email,
		"exp": time.Now().Add(1 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString([]byte(secret_key))
	return tokenString, err
}

func JWT_decrypt(tokenString string) (string, error) {
	fmt.Println("aaaa")
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret_key), nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		emails := claims["sub"].(string)
		return emails, nil
	} else {
		fmt.Println(token)
		fmt.Println(claims)
		return "", nil
	}
}
