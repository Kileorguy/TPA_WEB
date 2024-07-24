import {gql} from "@apollo/client";

export const Get_Notif = gql(
    `
    query GetNotif{
  getNotification{
    id
    user{
      email
    }
    text
  }
}
    `
)

export const Add_Notif = gql(

    `
    mutation CreateNotif($notif: String!){
  createNotification(input: $notif){
    id
    text
    
  }
}

    `
)