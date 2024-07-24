import './styles/notif.css'
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {useQuery} from "@apollo/client";
import {Get_Notif} from "../query/notifQueries.ts";
export default function Notif(){
    const {setNotifCount, user} = useContext(AuthContext)
    const [notif,setNotif] = useState()
    const {data : notifData} = useQuery(Get_Notif)

    useEffect(()=>{
        if(notifData){
            console.log(notifData.getNotification)
            setNotif(notifData.getNotification)
            setNotifCount(notifData.getNotification.length)
        }
    },[notifData])

    return(
        <div className='notifOuter'>
            <h1>Notification</h1>
            { notif && notif.map((n)=>{
                return(
                    <div className='notifCard'>
                        <p id='txt'>{n.text}</p>
                    </div>
                )
                })

            }

        </div>
    )
}