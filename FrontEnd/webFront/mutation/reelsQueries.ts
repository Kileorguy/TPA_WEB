import {gql} from "@apollo/client";

export const Create_Reels = gql(
    `
    mutation CreateReels($inputLink: String!, $text : String!) {
  createReels(input: $inputLink,text : $text) {
    Link
  }
}
    `
)

export const Get_Reels = gql(
    `
    query GetAllReels {
    getAllReels {
    Text
    ID
    Link
    User {
      firstName
      surname
      email
    }
    Comments{
      id
      user{
        firstName
        surname
        email
        profilePicture
      }
      text
    }
    CommentCount
    LikeCount
  }
}
    `
)

export const Get_Self_Reels = gql(
    `
    query GetSelfReels {
  getSelfReels {
    Text
    ID
    User {
      id
      firstName
      surname
    }
    Link
  }
}
    `
)

export const Delete_Self_Reels = gql(
    `
    mutation delete_Self_Reels{
  deleteSelfReels{
    ID
  }
}
    `

)

export const Add_Reels_Comment = gql(
    `
    mutation CreateReelsComment($reelsComment : RComment!){
      createReelsComment(input :$reelsComment){
        id
        reel{
          Text
        }
        user{
          id
          firstName
          surname
          email
          profilePicture
        }
        text
      }
    }
    `
)

export const Get_Reels_Email = gql(
    `
    query GetReelsEmail($email : String!){
  getReelsByEmail(input : $email){
    ID
    Text
    Link
  }
}
    `
)