
import {gql} from "@apollo/client";


export const Create_Group_Request = gql(
    `
    mutation createRequest($groupID:String!,$userEmail:String!){
    createRequest(groupID: $groupID, userID: $userEmail){
        id
        groupID
    }
}
    `
)

export const Get_Group_Request = gql(
    `
    query GetGrupReqs($groupID :String!){
    getGroupRequest(groupID:$groupID){
        id
        groupID
        user{
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

export const Accept_Group_Request = gql(
    `
    mutation AcceptGroupRequest($groupID : String!, $userEmail: String!){
    acceptRequest(groupID:$groupID, userID : $userEmail){
        id
        groupID
    }
}
    `
)
export const Delete_Group_Request = gql(
    `
    mutation DeleteGroupRequest($groupID : String!, $userEmail: String!){
    deleteRequest(groupID: $groupID, userID:$userEmail){
        id
        groupID
    }
}
    `
)