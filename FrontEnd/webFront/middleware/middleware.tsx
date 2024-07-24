import {useQuery} from "@apollo/client";
import {Validate_Token} from "../query/validateToken";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


export default function Middleware({children}: { children: JSX.Element }) {
    const n = useNavigate()
    const token = localStorage.getItem("token");
    const {loading, error, data} = useQuery(Validate_Token, {
        variables: {
            token: token
        }
    })
    if (error) {
        console.log(error)
    }

    useEffect(() => {
        if (data && !data.validateToken) {
            // console.log("SALAH")
            n('/login')
        }
        if (error) {
            n('/login')
        }
    }, [data, error])


    return (
        <>
            {/*{console.log(loading)}*/}
            {!loading &&
                children
            }
        </>
    )

}