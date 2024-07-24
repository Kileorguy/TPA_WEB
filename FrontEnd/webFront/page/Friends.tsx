import "./styles/friends.css"
import {useMutation, useQuery} from "@apollo/client";
import {Accept_Friend, Friend_Might_Know, Get_Friend_Request, Get_Friends} from "../query/friendQueries.ts";
import {useEffect, useState} from "react";
export default function Friends(){


    const[requests,setRequests] = useState<any>()
    const[friends, setFriends] = useState<any>()
    const{data,refetch : RefetchRequest} = useQuery(Get_Friend_Request)
    const{data : Friends,refetch : RefetchFriends} = useQuery(Get_Friends)
    const {data : FriendMightKnow} = useQuery(Friend_Might_Know)
    const [MK,setMK] = useState<any[]>()
    useEffect(()=>{
        if(FriendMightKnow){
            console.log(FriendMightKnow.getFriendsMightKnow)
            setMK(FriendMightKnow.getFriendsMightKnow)

        }
    },[FriendMightKnow])
    const[acceptRequest] = useMutation(Accept_Friend)

    async function handleAdd (id : string){
        console.log(id)
        await acceptRequest({
            variables:{
                senderId : id
            }
        })
        const newRequest = await RefetchRequest()
        setRequests(newRequest.data.getFriendRequest)
        const newFriends = await RefetchFriends()
        setFriends(newFriends.data.getFriend)

    }

    useEffect(()=>{
        if(data){
            // console.log(data.getFriendRequest)
            setRequests(data.getFriendRequest)
        }
    },[data])

    useEffect(()=>{
        if(Friends){
            console.log(Friends)
            setFriends(Friends.getFriend)
        }
    }, [Friends])


    return(

        <div className="outerFriend">

            <div className="section">
                <h1>Friend Requests</h1>
                {requests && requests.map((r : any)=>{
                    console.log(r)
                    return(
                        <div className="FriendCard">
                            <div className="friendProfile">

                                <img src={r.profilePicture} alt=""/>
                            </div>
                            <p>{r.firstName} {r.surname}</p>
                            <button onClick={(event) => {
                                event.preventDefault()
                                handleAdd(r.email)
                            }}> Accept
                            </button>
                        </div>
                    )
                })}
                <h1>Friends</h1>
                {
                    friends && friends.map((f : any)=>{
                       return(
                           <div className="FriendCard">
                               <div className="friendProfile">

                                   <img onClick={()=>{
                                       window.location.href = '/profile/'+f.id
                                   }} src={f.profilePicture} alt=""/>
                               </div>
                               <p>{f.firstName} {f.surname}</p>

                           </div>
                       )
                    })
                }
                <h1>You Might Know</h1>
                {
                    MK && MK.map((m)=>{
                        return(
                            <div className="FriendCard">
                                <div className="friendProfile">

                                    <img onClick={()=>{
                                        window.location.href = '/profile/'+m.id
                                    }} src={m.profilePicture} alt=""/>
                                </div>
                                <p>{m.firstName} {m.surname}</p>

                            </div>
                        )
                    })

                }

            </div>

        </div>
    )
}