import {gql} from "@apollo/client";

export const Create_User = gql(
    `
    mutation create($input : NewUser!){
      createUser(input:$input){
        firstName
        surname
        email
        DOB
        gender
        password
        role
      }
    }
    `

)