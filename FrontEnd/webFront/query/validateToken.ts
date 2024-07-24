import {gql} from "@apollo/client";

export const Validate_Token = gql(`
    query validateToken($token :String!){
    validateToken(token :$token)
}
`)