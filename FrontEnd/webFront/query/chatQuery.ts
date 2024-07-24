import {gql} from "@apollo/client";

export const Create_Chat_Room = gql(
    `
    mutation CreateChatRoom($chatRoomInput : createChatRoom!){
  createChatRoom(input : $chatRoomInput){
    id    
  }
}
    `
)

export const Get_Chat_Room = gql(
    `
    query GetChat{
  getChatRoom(user :""){
    id
    user1{
      id
      firstName
      surname
      email
      profilePicture
    }
    user2{
      id
      firstName
      surname
      email
      profilePicture
    }
  }
}
    `
)