package redis

import "github.com/redis/go-redis/v9"

var client *redis.Client

func GetRedisInstance() *redis.Client {
	if client == nil {
		clientcurr := redis.NewClient(&redis.Options{
			Addr:     "localhost:6379",
			Password: "",
			DB:       0,
		})
		client = clientcurr
	}
	return client
}
