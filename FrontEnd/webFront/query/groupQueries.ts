import {gql} from "@apollo/client";

export const Create_Group = gql(
    `
    mutation createGroup($title :String! , $privacy:String!){
  createGroup(title :$title, privacy:$privacy){
    id
    title
    privacy
  }
}
    `
)

export const Get_Group = gql(
    `
    query getGroup{
  getAllGroup{
    id
    title
    privacy
    member{
      user{
        id
        firstName
        surname
        email
        profilePicture
      }
    }
    admin{
      user{
        id
        firstName
        surname
        email
        profilePicture
      }
    }
  }
}
    `
)

export const Get_Group_Id = gql(
    `
    query getGroupId($groupID: String!){
  getGroupID(groupID :$groupID){
    id
    title
    privacy
    member{
      user{
        id
        firstName
        surname
        email
        profilePicture
      }
    }
    admin{
      user{
        id
        firstName
        surname
        email
        profilePicture
      }
    }
  }
}
    `
)

export const Create_Group_Member = gql(
    `
    mutation CreateGroupMember($groupMember : inputGroupMember!){
  createGroupMember(input: $groupMember){
    id
    group{
      id
    }
  
    isAdmin
  }
}
    `
)

export const Self_Group = gql(
    `
    query getSelfGroups{
  getSelfGroups{
    id
    title
    privacy
  }
}
    `
)

export const Get_Post_Group = gql(
    `
    query GetPostGroup($groupID : String!){
  getPostGroupID(groupID: $groupID){
    groupID
    id
    user{
      email
      firstName
      surname
      profilePicture
    }
    privacy
    text
    likeCount
    comments{
      id
      user{
        firstName
        surname
        email
        profilePicture
      }
      text
       reply{
        user{
            firstName
            surname
            email
            profilePicture
        }
        text
    }
    }
    commentCount
    files{
      file
    }
  }
}
    `
)

export const Get_Group_Role = gql(
    `
    query getRoleByAuth($groupID : String!){
  getRoleByAuth(groupID : $groupID){
    id
    isAdmin
  }
}
    `
)

export const Leave_Group = gql(
    `
    mutation LeaveGroup($groupID: String!){
  leaveGroup(groupID: $groupID){
    id
  }
}

    `
)


export const Promote_Member = gql(
    `
    mutation MemberToAdmin($groupID : String!, $userEmail :String!){
  setToAdmin(userID : $userEmail, groupID: $groupID){
    id
    isAdmin
  }
}
    `
)

export const Kick_Member = gql(
    `
mutation KickGroupMember($groupID : String!, $userEmail :String!){
  kickMember(userID : $userEmail, groupID: $groupID){
    id
  }
}
    `
)