import './styles/chat.css'
import {useQuery} from "@apollo/client";
import {Get_Friends} from "../query/friendQueries.ts";
import {useContext, useEffect, useState} from "react";
import {Get_Chat_Room} from "../query/chatQuery.ts";
import {addDoc, collection, query, where, onSnapshot, getDocs, serverTimestamp, orderBy} from "firebase/firestore";
import {AuthContext} from "../context/AuthContext.tsx";
import {db, GetChatRef, GetReelsRef} from "../firebase/init.ts";
import {getDownloadURL, uploadBytes} from "firebase/storage";
import {unstable_renderSubtreeIntoContainer} from "react-dom";

export default function Chat() {
    const {picturePath, user: currUser} = useContext(AuthContext)
    const [chatId, setChatId] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const {data} = useQuery(Get_Friends)
    const [friends, setFriends] = useState<any[]>()
    const [rooms, setRooms] = useState<any[]>()
    const {data: chatRoom} = useQuery(Get_Chat_Room)
    const [chats, setChats] = useState<any[]>()
    const [userFilter, setUserFilter] = useState("")
    const [chatFilter, setChatFilter] = useState("")
    const [fileUpload, setFileUpload] = useState<File>()
    const qCol =
        query(collection(db, "chat"),where("ID", "==", chatId), orderBy("Time"))


    useEffect(() => {
        const unsubscribe = onSnapshot(qCol, async (querySnapshot) => {

            const data = querySnapshot.docs;

            if(!data) return;
            const chatArr = []
            // console.log(qs.docs)
            data.forEach((doc: any) => {
                console.log("tes")
                // console.log(doc.id, " => ", doc.data());
                chatArr.push(doc.data())
            });
            setChats(chatArr)

        })

    }, [chatId, ])

    useEffect(() => {
        if (chatRoom) {
            // console.log("Chat Room",chatRoom.getChatRoom)
            setRooms(chatRoom.getChatRoom)
        }
    }, [chatRoom])

    useEffect(() => {

        if (data) {
            // console.log(data.getFriend)
            setFriends(data.getFriend)

        }
    }, [data])

    return (
        <div className='chatOuter'>
            <div className='chatLeft'>
                <input onChange={(event) => {
                    setUserFilter(event.target.value)
                    console.log(userFilter)
                }} type="text"/>
                {rooms && rooms.map((f) => {
                    // console.log(f)
                    var us
                    if(currUser && f){
                        us = f.user1.email != currUser.email ? f.user1 : f.user2
                    }
                    const fullnem : string = us.firstName + "_" + us.surname
                    console.log("FULL NAME",fullnem)
                    if (userFilter != "") {
                        if (fullnem && fullnem.includes(userFilter)) {
                            console.log("fullname includes")
                            return (
                                <div className='chatMedia' onClick={() => {
                                    setChatId(f.id)
                                }}>
                                    <div className='chatPic'>
                                        <img src={us.profilePicture} alt=''/>
                                    </div>
                                    <p> {us.firstName} {us.surname} </p>
                                </div>
                            )
                        }

                    } else {

                        return (
                            <div className='chatMedia' onClick={() => {
                                setChatId(f.id)
                            }}>
                                <div className='chatPic'>
                                    <img src={us.profilePicture} alt=''/>
                                </div>
                                <p> {us.firstName} {us.surname} </p>
                            </div>
                        )
                    }
                })
                }

            </div>

            <div className='chatRight'>

                {chatId && <input type="text" onChange={(event) => {
                    setChatFilter(event.target.value)
                }} placeholder='Filter Chat'/>}
                <div className='bubbleContainer'>
                    <br/>
                    {

                        chats && chats.map((c) => {

                                console.log(c)
                            if (chatFilter != "") {
                                if (c.Text&&c.Text.includes(chatFilter)) {
                                    if (c.User == currUser.email) {
                                        if (c.Text) {
                                            return (
                                                <div className='bubbleRight'>
                                                    {c.Text}
                                                </div>
                                            )
                                        }
                                        if (c.Link) {
                                            return (
                                                <div className='bubbleRight'>
                                                    <img src={c.Link} alt=""/>
                                                </div>

                                            )
                                        }
                                    } else {
                                        if (c.Text) {

                                            return (

                                                <div className='bubble'>
                                                    {c.Text}
                                                </div>
                                            )
                                        }
                                        if (c.Link) {
                                            return (
                                                <div className='bubble'>
                                                    <img src={c.Link} alt=""/>
                                                </div>

                                            )
                                        }
                                    }
                                }
                            } else {
                                if (c.User == currUser.email) {
                                    if (c.Text) {

                                        return (
                                            <div className='bubbleRight'>
                                                {c.Text}
                                            </div>

                                        )
                                    }
                                    if (c.Link) {
                                        return (
                                            <div className='bubbleRight'>
                                                <img src={c.Link} alt=""/>
                                            </div>

                                        )
                                    }
                                } else {
                                    if (c.Text) {
                                        return (

                                            <div className='bubble'>
                                                {c.Text}
                                            </div>
                                        )
                                    }
                                    if (c.Link) {
                                        return (
                                            <div className='bubble'>
                                                <img src={c.Link} alt=""/>
                                            </div>

                                        )
                                    }
                                }
                            }


                        })
                    }


                </div>
                <input value={message} onKeyDown={async (event) => {
                    // console.log(event.key)
                    if (event.key === "Enter") {
                        console.log("enter")
                        if (chatId != "") {
                            console.log("UPLOAD")
                            await addDoc(collection(db, "chat"), {
                                Time: serverTimestamp(),
                                ID: chatId,
                                Text: message,
                                User: currUser.email,
                            })
                            // console.log("Document written with ID: ", docRef.id);
                            setMessage("")

                        }
                    }

                }} onChange={(event) => {
                    setMessage(event.target.value)
                }} className='inputText' type="text" placeholder={chatId}/>
                <div className='chatFileContainer'>
                    <input onChange={(event) => {
                        setFileUpload(event.target.files?.[0])
                    }} type="file"/>
                    <button onClick={async () => {
                        if (fileUpload) {
                            await uploadBytes(GetChatRef(fileUpload?.name), fileUpload).then(async () => {
                                    console.log("Upload File Msg")
                                    const link = await getDownloadURL(GetChatRef(fileUpload?.name))
                                    console.log(link)

                                    await addDoc(collection(db, "chat"), {
                                        Time: serverTimestamp(),
                                        ID: chatId,
                                        Link: link,
                                        User: currUser.email,
                                    })
                                }
                            )

                        }

                    }}>Upload
                    </button>
                </div>

            </div>
        </div>
    )
}