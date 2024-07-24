import {gql} from "@apollo/client";

export const Add_Group_File = gql(
    `
    mutation CreateGroupFiles($groupID: String!, $link : String!, $fileName:String!){
  createGroupFiles(groupID: $groupID, link: $link, fileName: $fileName){
    id
    fileName
    link
    
  }
}
    `
)

export const Get_Group_File = gql(
    `
    query GetGroupFiles($groupID : String!){
\tgetGroupFiles(groupID : $groupID){
    id
    fileName
    link
    user{
        firstName
        surname
        email
        profilePicture
        id
    }
  }
\t
}

    `
)

export const Update_File = gql(
    `
    mutation setLink($id: String!, $linkBaru : String!){
  setLinkInDB(id : $id, link : $linkBaru){
    id
    fileName
    link
    
  }
}

    `
)