import {gql, useQuery} from "@apollo/client";
// import {Validate_Token} from "./validateToken.ts";

export const Get_User = gql(
    `
    query GetUser {
  getUser {
    id
    firstName
    surname
    email
    DOB
    gender
    profilePicture
    password
    role
    active
  }
}  `
)

export const Get_User_Email = gql(
    `
    query GetUserByEmail($token: String!){
  getUserbyEmail(token : $token){
    id
    firstName
    surname
    DOB
    profilePicture
    email
    password
    DOB
    gender
    active
    Friends{
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

export const getProfile = async(token : string | null) =>{
    // @ts-ignore
    const {loading, error, data} = useQuery(Get_User_Email,{
        variables: {
            token: token
        }
    })
    if(!loading){
        console.log(data)
        return data
    }

}

export const Get_Name = gql(
    `
    query GetName($email: String){
    getUserbyEmail(email : $email){
        firstName
        surname
  }
}
    `
)

export const Do_Login = gql(
    `
        query doLogin($email :String!, $password : String!){
        login(email :$email, password:$password)
    }
    `
)
export const AddOrUpdateProfile = gql(
    `
    mutation addUpdateProfile($link : String!, $email :String!){
  addOrUpdateProfile(link :$link,  email : $email){
    email
    profilePicture
  }
}
    `
)

export const Search_User = gql(
    `
    query SearchUser($search : String!){
  getUserSearch(input : $search){
  id
    firstName
    surname
    email
    profilePicture
  }
}
    `
)

export const Get_User_By_ID = gql(
    `
    query GetUserByID($userID :String!){
    getUserByID(id :$userID){
    id
    firstName
    surname
    email
    profilePicture
    Friends{
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