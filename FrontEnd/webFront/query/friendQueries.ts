import {gql} from "@apollo/client";

export const Get_Friend_Request = gql(
    `
    query GetFriendRequest{
  getFriendRequest(input:""){
    id
    email
        firstName
    surname
    profilePicture
  }
}
    `
)

export const Get_Friends = gql(
    `
    query GetFriend{
  getFriend(input :""){
    id
    email
    firstName
    surname
    profilePicture
  }
}
    `
)
export const Accept_Friend = gql(
    `
    mutation AcceptFriendRequest($senderId: String!){
      acceptFriendRequest(senderId: $senderId)
    }
    `
)

export const Create_Friends = gql(
    `
    mutation CreateFriends($friendEmail : String!){
  createFriends(input: $friendEmail){
  accepted
  }
}`
)

export const Might_Know = gql(
    `
    query MightKnow($email : String!){
  getMightKnow(input : $email){
    id
    firstName
    surname
    email
    profilePicture
  }
}
    `
)

export const Friend_Might_Know = gql(
    `
    query FriendMightKnow{
  getFriendsMightKnow{
    id
    firstName
    surname
    email
    profilePicture
  }
}
    `
)