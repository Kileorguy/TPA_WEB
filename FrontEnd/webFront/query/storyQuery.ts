import {gql} from "@apollo/client";

export const Create_Text_Story = gql(
    `
    mutation CreateTextStory($textStory : newTextStory!){
    createTextStory(input: $textStory){
        id
        text
        textColor
        backgroundColor
        link
        createdAt
    }
}
    `
)

export const Create_Photo_Story = gql(
    `
    mutation CreatePhotoStory($photoStory : newPhotoStory!){
        createPhotoStory(input: $photoStory){
            id
            text
            textColor
            backgroundColor
            link
            createdAt
        }
    }
    `
)

export const Get_Friend_Stories = gql(
    `
    query GetFriendsStories{
        getFriendsStories{
            id
            text
            user{
                id
                firstName
                surname
                email
                profilePicture
            }
            textColor
            backgroundColor
            createdAt
            link
        }
    }
    
    `
)

export const Validate_Story = gql(
    `
    mutation Validate24h{
  validate24H
}`
)