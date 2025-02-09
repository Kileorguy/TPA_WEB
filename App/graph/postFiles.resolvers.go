package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.36

import (
	"context"

	"github.com/Kileorguy/graph/model"
	"github.com/google/uuid"
)

// CreatePostFile is the resolver for the createPostFile field.
func (r *mutationResolver) CreatePostFile(ctx context.Context, input string, postID string) (*model.PostFile, error) {
	ID := uuid.NewString()
	var Files = &model.PostFile{
		ID:     ID,
		PostID: postID,
		File:   input,
	}
	r.DB.Create(&Files)
	return Files, r.DB.Preload("Post").First(&Files, "id = ?", ID).Error

	//panic(fmt.Errorf("not implemented: CreatePostFile - createPostFile"))
}
