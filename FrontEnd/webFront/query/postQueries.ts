import {gql} from "@apollo/client";


export const Get_All_Post =  gql(`
    query GetAllPost{
  getAllPost{
    groupID
    id
    user{
    id
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
      id
        firstName
        surname
        email
        profilePicture
      }
      text
       reply{
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
    commentCount
    files{
      file
    }
  }
}

`)

export const Upload_Post = gql(
    `
    mutation CreatePost ($postInput :NewPost!){
  createPost(input : $postInput){
    id
    privacy
    text
  }
}

    `
)

export const Search_Post = gql(
    `
    query SearchPost($search: String!){
  getSearchedPost(input: $search){
    user{
      email
      firstName
      surname
      profilePicture
    }
    text
  }
}
    `
)

export const Get_User_Post = gql(
    `
    query GetUserPost($email: String!){
  getUserPost(input :$email){
    text
    likeCount
    privacy
    user{
      firstName
      surname
      email
      profilePicture
    }
  }
}
    `
)

export const Create_Group_Post = gql(
    `
    mutation CreatePostGr($postInput : NewPost!, $groupID : String!){
  createPostGroup(input : $postInput, groupID:$groupID){
    id
    text
    groupID
  }
}
    `
)

export const Get_Post_byID = gql(
    `
    query getPostbyI($userID: String!) {
  getUserIdPost(postID: $userID) {
    id
    user {
      firstName
      surname
      profilePicture
    }
    privacy
    text
    likeCount
    comments {
      id
      user {
        firstName
        surname
        email
        profilePicture
      }
      text
      reply {
        user {
          firstName
          surname
          email
          profilePicture
        }
        text
      }
    }
  }
}
    `
)

export const Add_File = gql(
    `
    mutation addPostFile($file : String!, $postID : String!){
  createPostFile(input : $file, postID : $postID){
    id
    post{
      id
    }
    file
  }
}
    `
)

export const Delete_Post = gql(
    `
    mutation deletePost($postID: String!){
  deletePost(id : $postID){
    id
  }
}
    `
)