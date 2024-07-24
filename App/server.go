package main

import (
	"context"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Kileorguy/database"
	"github.com/Kileorguy/graph"
	"github.com/Kileorguy/helper"
	"github.com/Kileorguy/middleware"
	"github.com/Kileorguy/redis"
	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"log"
	"net/http"
	"os"
)

const defaultPort = "8080"

var config = graph.Config{}

func main() {
	r := chi.NewRouter()
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{helper.GoDotEnvLoader("ALLOWED_ORIGINS")},
		AllowCredentials: true,
		Debug:            true,
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
	}).Handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	//dsn := "host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"
	//db, err := gorm.Opesn(postgres.Open(dsn), &gorm.Config{})

	database.Migrate()

	config = graph.Config{Resolvers: &graph.Resolver{
		DB:    database.GetInstance(),
		Redis: redis.GetRedisInstance(),
	}}

	r.Use(middleware.AuthMiddleware)
	config.Directives.Auth = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
		token := ctx.Value("token")
		log.Printf("Token :: {%s}", token)
		if token == nil {
			return nil, &gqlerror.Error{Message: "Error Credentials"}
		}
		ctx = context.WithValue(ctx, "Email", token)
		return next(ctx)
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(config))

	r.Handle("/", playground.Handler("GraphQL playground", "/query"))
	r.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
