import './styles/userProfile.css'
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {useMutation, useQuery} from "@apollo/client";
import {Get_Post_byID, Get_User_Post} from "../query/postQueries.ts";
import {AiFillLike} from "react-icons/ai";
import {FaShare} from "react-icons/fa";
import {useParams} from "react-router-dom";
import {Get_User_By_ID} from "../query/getUser.ts";
import {Add_Post_Like} from "../query/likeQueries.ts";
import {Add_Reply} from "../query/commentQuery.ts";
import {Create_Friends, Might_Know} from "../query/friendQueries.ts";
import {Create_Chat_Room} from "../query/chatQuery.ts";
import {Get_Reels_Email} from "../mutation/reelsQueries.ts";

export default function UserProfile() {
    const params = useParams()
    const {picturePath, user: currUser} = useContext(AuthContext)
    const [replyModal, setreplyModal] = useState<boolean>(false)
    const [replyText, setReplyText] = useState<string>("")
    const [userFriends, setUserFriends] = useState<any[]>()
    const [user, setUser] = useState<any>()
    const [posts, setPost] = useState<any[]>()
    const [mutual, setMutual] = useState(0)
    const {data} = useQuery(Get_Post_byID, {
        variables: {
            "userID": params.id
        }
    })
    const [reels, setReels] = useState()

    const {data: reelsData} = useQuery(Get_Reels_Email, {
        variables: {
            "email": user && user.email
        }
    })

    useEffect(() => {
        console.log("REeelllsss")
        if (reelsData) {
            console.log("REL", reelsData.getReelsByEmail)
            setReels(reelsData.getReelsByEmail)
        }
    }, [reelsData])

    const {data: mightKnow} = useQuery(Might_Know, {
        variables: {
            "email": params.id
        }
    })
    const [mightKnowFriends, setMightKnowFriends] = useState<any[]>()
    useEffect(() => {
        if (mightKnow) {
            console.log("Might Know", mightKnow.getMightKnow)
            setMightKnowFriends(mightKnow.getMightKnow)
        }
    }, [mightKnow])

    const [addReply] = useMutation(Add_Reply)
    const [addFriend] = useMutation(Create_Friends)
    const [createChatRoom] = useMutation(Create_Chat_Room)

    async function handleReplyUpload(event) {
        event.preventDefault()
        await addReply({
            variables: {
                "replyInput": {
                    "commentID": currCommentId,
                    "text": replyText
                }
            }
        })
    }

    const [currCommentId, setCurrCommentId] = useState<string>("")
    const {data: dataUser} = useQuery(Get_User_By_ID, {
        variables: {
            "userID": params.id
        }
    })
    // console.log("PARAMS",params.id)
    // console.log(data)
    const [AddPostLike] = useMutation(Add_Post_Like)

    async function LikePost(event, id: string) {
        event.preventDefault()
        await AddPostLike({
            variables: {
                "postID": id
            }
        })

    }

    useEffect(() => {
        // console.log("asdasdasd",data && data.getUserPost)
        setPost(data && data.getUserIdPost)
        // setUser(posts && posts[0])
        console.log(data && data.getUserIdPost)
    }, [data])

    useEffect(() => {
        console.log(dataUser && dataUser.getUserByID)
        setUser(dataUser && dataUser.getUserByID)
        setUserFriends(dataUser && dataUser.getUserByID.Friends)
        if (dataUser && currUser &&currUser.Friends) {
            const freunden = dataUser.getUserByID.Friends
            for (let i = 0; i < freunden.length; i++) {
                for (let j = 0; j < currUser.Friends.length; j++) {
                    if (freunden[i].email == currUser.Friends[j].email) {
                        setMutual(mutual + 1)
                    }
                }
            }
        }
    }, [dataUser])
    // useEffect(()=>{
    //
    // },[user])
    // @ts-ignore
    return (
        <div className='userProfileOuter'>
            {replyModal && <div className="postModal">

                <div className='outerMakePost'>
                    <div className='mainComp'>
                        <div className='upper'>
                            <div className='profilePict'>
                                <img src={picturePath}/>
                            </div>
                            <div>
                                <p>Name</p>
                                <select name="" id="" onChange={(event) => {

                                }}>
                                    <option value="Public">Public</option>
                                    <option value="CloseFriend">Teman Dekat</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>
                            <button className="postModalButton" onClick={() => {
                                setreplyModal(false)
                            }}>Close
                            </button>
                        </div>
                        <textarea className='thoughts' onChange={(event) => {
                            setReplyText(event.target.value)
                        }}/>
                        <div className='others'>
                            <input type="file"/>
                        </div>
                        <button onClick={(event) => {
                            handleReplyUpload(event)
                        }}>Kirim
                        </button>
                    </div>
                </div>

            </div>
            }

            <div className='userProfileMain'>
                <img src="../assets/bg.jpg" alt=""/>
                <div className='btnContainer'>
                    {(user && user.id) != (currUser && currUser.id) &&
                        <button onClick={async () => {

                            await createChatRoom({
                                variables: {
                                    "chatRoomInput": {
                                        "user2ID": user.email,
                                        "userID": ""
                                    }
                                }
                            })

                            window.location.href = '/chat'
                        }}>Message</button>
                    }
                    {(user && user.id) == (currUser && currUser.id) && <button onClick={() => {
                        window.location.href = "/profile"
                    }}> Edit Profile
                    </button>}
                    {(user && user.id) != (currUser && currUser.id) &&
                        <button onClick={async (event) => {
                            event.preventDefault()
                            await addFriend({
                                variables: {
                                    "friendEmail": user.email
                                }
                            })
                        }}>Add</button>
                    }

                </div>
                <div className='userDetail'>
                    <img src={user && user.profilePicture} alt=""/>
                    <div className='innerDetail'>
                        <p>{user && user.firstName} {user && user.surname}</p>
                        <p>Friends : {userFriends && userFriends.length} Mutuals : {mutual}</p>
                        <p>Might Know : </p>
                        <div className='mightKnow'>
                            {mightKnowFriends && mightKnowFriends.map((m) => {
                                return (
                                    <div className='mightKnowInner'>
                                        <img onClick={() => {
                                            window.location.href = '/profile/' + m.id
                                        }} src={m.profilePicture} alt="" id='innerMK'/>

                                        <h2>
                                            {m.firstName} {m.surname}
                                        </h2>
                                        <button id='MKBtn' onClick={() => {
                                            const filtered = mightKnowFriends?.filter((mk) => {
                                                if (mk.id != m.id) {
                                                    return true
                                                }
                                            })
                                            setMightKnowFriends(filtered)
                                        }}>Remove
                                        </button>
                                        <button id='MKBtn' onClick={async (event) => {
                                            event.preventDefault()
                                            await addFriend({
                                                variables: {
                                                    "friendEmail": m.email
                                                }
                                            })
                                            console.log("add")
                                        }}>Add
                                        </button>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>


                </div>
                <div className='friendReels'>
                    <div className='profileReels'>
                        <video controls autoPlay={true} loop src={reels && reels.Link}></video>
                    </div>
                    <div className='freundenList'>
                        <h1>Friends</h1>
                        {
                            user && user.Friends.map((m) => {
                                console.log(m)
                                return (
                                    <div className='mightKnowInner'>
                                        <img onClick={() => {
                                            window.location.href = '/profile/' + m.id
                                        }} src={m.profilePicture} alt="" id='innerMK'/>

                                        <h2>
                                            {m.firstName} {m.surname}
                                        </h2>

                                    </div>
                                )
                            })

                        }
                    </div>
                </div>

                {
                    posts && posts.map((post: any) => {
                        const postUser: any = post.user
                        const comments: any[] = post.comments
                        // console.log(postUser)

                        // getLikePost(post.id)
                        // let likeCount = 0
                        // getPostLike({
                        //     variables:{
                        //         "postID" : post.id
                        //     }
                        // }).then(
                        //     console.log("Likes : ", PostLike)

                        //
                        // )
                        // console.log(post)
                        return (
                            <>
                                <div className='cardContainer'>
                                    <div className='upperPost'>
                                        <div className='postPic1'>

                                            <img src={postUser.profilePicture}/>
                                        </div>

                                        <p>{postUser.firstName} {postUser.surname}</p>
                                    </div>
                                    <div className='content'>
                                        <p dangerouslySetInnerHTML={{
                                            __html: post.text
                                        }}></p>
                                    </div>
                                    <div id='line1'></div>
                                    <div className='interactPost'>
                                        <div className='interactItem' onClick={
                                            (event) => {
                                                LikePost(event, post.id)


                                            }
                                        }>

                                            <AiFillLike/>
                                            Like {post.likeCount}
                                        </div>
                                        <div className='interactItem'>
                                            <FaShare/>
                                            Share
                                        </div>
                                    </div>
                                    <div id='line1'></div>
                                    <div className='comments'>
                                        <div className='comment'>
                                            <div className='insideComment'>
                                                <div className='profilePict'>
                                                </div>

                                                <div className='commentTemplate'>
                                                    <p>Write a comment...</p>
                                                </div>
                                            </div>
                                        </div>
                                        {comments && comments.map((c) => {
                                            // console.log(c && c.reply)
                                            const reply = c && c.reply

                                            return (
                                                <div className='comment'>
                                                    <div className='insideComment'>
                                                        <div className='profilePict'>
                                                            <img src={c && c.user.profilePicture}/>
                                                        </div>

                                                        <div className='commentContent'>
                                                            {c && c.user.firstName} {c && c.user.surname}
                                                            <br/> {c && c.text}
                                                        </div>
                                                    </div>

                                                    <div className='commentInteract'>
                                                        <p>Like</p>
                                                        <p className='click' onClick={() => {
                                                            setCurrCommentId(c && c.id)
                                                            setreplyModal(!replyModal)
                                                            console.log("Commenttt ", c.id)
                                                        }}>Reply</p>
                                                    </div>
                                                    {
                                                        reply && reply.map((r: any) => {
                                                                return (
                                                                    <div className='replyOuter'>
                                                                        <div className='insideComment'>
                                                                            <div className='profilePict'>
                                                                                <img src={r && r.user.profilePicture}/>
                                                                            </div>

                                                                            <div className='commentContent'>
                                                                                {r && r.user.firstName} {r && r.user.surname}
                                                                                <br/>
                                                                                <p dangerouslySetInnerHTML={{
                                                                                    __html : r && r.text
                                                                                }}>

                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className='commentInteract'>
                                                                            <p>Like</p>
                                                                            <p>Reply</p>

                                                                        </div>

                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>

                                            )
                                        })

                                        }

                                    </div>
                                </div>
                            </>
                        )
                    })
                }
            </div>

        </div>

    )


}