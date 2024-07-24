import {createContext, useEffect, useState} from "react";
import {useLazyQuery, useQuery} from "@apollo/client";
import {Get_User_Email} from "../query/getUser";
import {Get_Notif} from "../query/notifQueries.ts";

export const AuthContext = createContext<any>(null)


interface AuthProvider {
    children: JSX.Element
}

export default function AuthProvider({children}: AuthProvider) {

    const [user, setUser] = useState(null)
    const [getUserByEmail, {data, refetch}] = useLazyQuery(Get_User_Email)
    const [notifCount, setNotifCount] = useState(0)
    const [theme, setTheme] = useState<string>("Light")
    useEffect(()=>{
        if(theme == "Light"){
            document.documentElement.style.setProperty('--background-color', '#dfe3ee');
            document.documentElement.style.setProperty('--text-color', 'black');
            document.documentElement.style.setProperty('--second-background-color', 'white');
            document.documentElement.style.setProperty('--third-background-color', '#8b9dc3');



        }else{
            document.documentElement.style.setProperty('--background-color', '#18191a');
            document.documentElement.style.setProperty('--text-color', 'white');
            document.documentElement.style.setProperty('--second-background-color', '#3a3b3c');
            document.documentElement.style.setProperty('--third-background-color', '#3a3b3c');





        }
    },[theme])

    function changeTheme(){
        if(theme=='Light'){
            setTheme('Dark')
        }else{
            setTheme('Light')
        }
    }

    const login = () => {
        const token = localStorage.getItem("token")
        getUserByEmail({
            variables: {
                token: token
            }
        }).then()
    }

    const userCheck = () => {
        // login()
        console.log(data)
        console.log(user)
    }

    useEffect(() => {
        // setUser(data.)
        if (data) {
            setUser(data.getUserbyEmail)

            console.log(data.getUserbyEmail)
        }
        // console.log(data.getUserByEmail)
    }, [data])
    const [picturePath, setPicturePath] = useState("../assets/defaultPict.jpg")

    useEffect(() => {
        if (user && user.profilePicture) {
            console.log("QASDASDADQWE")
            console.log(picturePath)
            setPicturePath(user.profilePicture)
        }
    }, [user])
    const {data: notifData} = useQuery(Get_Notif)

    useEffect(() => {
        if (notifData) {

            setNotifCount(notifData.getNotification.length)
        }
    }, [notifData])
    useEffect(() => {
        login()

    }, [])
    return (
        <AuthContext.Provider value={{
            user, login, userCheck, picturePath,
            refetch, setNotifCount, notifCount, theme, setTheme, changeTheme
        }}>
            {children}
        </AuthContext.Provider>
    )
}