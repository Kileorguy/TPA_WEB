import {gql} from "@apollo/client";

export const Add_Post_Like = gql(
    `
    mutation AddPostLike ($postID :String!){
    addPostLike(postId:$postID, userId:""){
    post{
      id
    }
    User{
      email
    }
  }
}
    `
)

export const Get_Post_Like = gql(
    `
    query GetPostLike($postID: String!){
  getPostLikes(input :$postID){
    User{
      email
      firstName
      surname
    }
  }
}
    `
)

export const Add_Reels_Like = gql(
    `
    mutation AddReelsLike($reelsID : String!){
  addReelsLike(reelsId : $reelsID, userID :""){
    reels{
      ID
    }
    User{
      email
    }
  }
}
    `
)