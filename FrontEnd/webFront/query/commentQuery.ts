import {gql} from "@apollo/client";

export const Add_Comment = gql(
    `
    mutation AddComment($commentInput : commentInput!){
  createComment(input :$commentInput){
    id
    user{
      firstName
      surname
      profilePicture
    }
    text
  }
}
    `
)

export const Add_Reply = gql(
    `
    mutation addReply($replyInput : ReplyInput!){
  addReply(input:$replyInput){
    text  
  }
}

    `
)