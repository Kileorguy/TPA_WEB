import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {Validate_Token} from "../query/validateToken";
import {useEffect} from "react";

export default function RevMiddleware({children}: { children: JSX.Element }){

    const n = useNavigate()
    const token = localStorage.getItem("token");
    const {loading, error, data} = useQuery(Validate_Token,{
        variables: {
            token: token
        }
    })
    if(error){
        console.log(error)
    }

    console.log(data)
    useEffect(() => {
        if(!error&&data && data.validateToken){
            n('/home')
        }
    }, [data,error])

    return (
        <>
            {/*{console.log(loading)}*/}
            { !loading &&
                children
            }
        </>
    )

}