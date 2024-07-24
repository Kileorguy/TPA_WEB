import './styles/reels.css'
import {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {Add_Reels_Comment, Create_Reels, Get_Reels} from "../mutation/reelsQueries.ts";
import {uploadBytes, getDownloadURL} from "firebase/storage";
import {GetProfilePictRef, GetReelsRef} from "../firebase/init.ts";
import {Add_Reels_Like} from "../query/likeQueries.ts";

export default function Reels() {

    const [reels, setReels] = useState<any[]>()
    const [idx, setIdx] = useState(0)
    const [file, setFile] = useState<File>()
    const [error, setError] = useState("")
    const [CreateReels] = useMutation(Create_Reels)
    const [dur, setDur] = useState(0)
    const {data, refetch} = useQuery(Get_Reels)
    const [AddLike] = useMutation(Add_Reels_Like)
    const [comments, setComments] = useState<any[]>()
    const [commentInput, setCommentInput] = useState("")
    const [addReelsComment] = useMutation(Add_Reels_Comment)
    const [showComment, setShowComment] = useState(false)

    async function likeReels() {
        console.log(reels && reels.length > 0 && reels && reels[idx].ID)
        await AddLike({
            variables: {
                "reelsID": reels && reels.length > 0 && reels && reels[idx].ID
            }
        })
        await refetch()
    }

    async function addComment(id: string) {

        console.log(commentInput, id)
        if (commentInput == "") {
            return
        }
        await addReelsComment({
            variables: {
                "reelsComment": {
                    "reelsID": id,
                    "text": commentInput,
                }
            }
        })

    }

    useEffect(() => {
        if (data) {
            console.log(data.getAllReels)
            setReels(data && data.getAllReels)
            console.log(reels)
        }
    }, [data])

    useEffect(() => {
        console.log(reels && "reels", reels)
    }, [reels])

    function nextIdx(event) {
        event.preventDefault()
        setIdx((idx + 1) % (reels ? reels.length : 1))
        console.log(reels && reels[idx])
    }

    async function handleUpload(event: any) {
        setError("")
        event.preventDefault()
        console.log("Uploading...")
        if (file) {
            const videoElement = document.createElement("video");

            videoElement.src = URL.createObjectURL(file);
            // console.log(videoElement.duration)
            videoElement.onloadedmetadata = async function () {
                setDur(videoElement.duration);
                console.log(videoElement.duration)

                if (videoElement.duration < 1 || videoElement.duration > 60) {
                    setError("Invalid Duration")
                    console.log(videoElement.duration)
                    return
                }


                // console.log("DUR",dur)
                // return
                await uploadBytes(GetReelsRef(file?.name), file).then(async () => {
                        console.log("Upload Reels")
                        const link = await getDownloadURL(GetReelsRef(file?.name))


                        await CreateReels({
                            variables: {
                                "inputLink": link
                            }
                        })
                        const newData = await refetch()
                        console.log("hehehheheh", newData.data.getAllReels)
                    }
                )

            }

        }


    }

    function prevIdx(event) {
        console.log(reels)
        event.preventDefault()
        let size = 0
        if (reels) {
            size = reels.length
        } else {
            size = 0
        }
        setIdx(idx <= 0 ? size - 1 : idx - 1)
    }

    return (
        <div className='ReelsOuter'>
            <div className='leftReels'>
                {/*<input type="file" onChange={(event) => {*/}
                {/*    event.preventDefault()*/}
                {/*    setFile(event.target.files?.[0])*/}
                {/*}}/>*/}
                <button onClick={() => {
                    window.location.href = 'createReels'
                }}>Upload
                </button>
                {/*{error}*/}
                <h1>-{reels && reels[idx] && reels[idx].Text}-</h1>
            </div>

            <div className='midReels'>
                <video controls autoPlay={true} loop src={reels && reels?.length > 0 && reels[idx].Link}></video>
            </div>

            <div className='rightReels'>
                <h1>{reels && reels.length > 0 && reels && reels[idx].User.firstName} {reels && reels.length > 0 && reels[idx].User.surname}</h1>
                <div className='rightReelsButton'>
                    <button onClick={prevIdx}>Prev</button>
                    <button onClick={nextIdx}>Next</button>
                </div>
                <button onClick={likeReels}>Like</button>
                <p>Like Count : {reels && reels[idx]&&reels[idx].LikeCount}</p>
                <input type='text' onKeyDown={(event) => {
                    // console.log(event.key)
                    if (event.key === "Enter") {
                        addComment(reels && reels[idx].ID)
                        // setCommentInput("")
                    }

                }} onChange={(event) => {
                    // console.log(event.target.value)
                    setCommentInput(event.target.value)

                }} className='commentTemplate' placeholder='Write a comment..   .'/>
                Comment count : {reels && reels[idx] && reels[idx].CommentCount}
                <button onClick={() => {
                    setShowComment(true)
                }}>Load Comment
                </button>
                {showComment && reels && reels[idx].Comments.map((c) => {
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
                                    // setCurrCommentId(c && c.id)
                                    // setreplyModal(!replyModal)
                                    console.log("Commenttt ", c.id)
                                }}>Reply</p>
                            </div>
                            {/*{*/}
                            {/*    reply && reply.map((r: any) => {*/}
                            {/*            return (*/}
                            {/*                <div className='replyOuter'>*/}
                            {/*                    <div className='insideComment'>*/}
                            {/*                        <div className='profilePict'>*/}
                            {/*                            <img src={r && r.user.profilePicture}/>*/}
                            {/*                        </div>*/}

                            {/*                        <div className='commentContent'>*/}
                            {/*                            {r && r.user.firstName} {r && r.user.surname}*/}
                            {/*                            <br/> {r && r.text}*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}

                            {/*                    <div className='commentInteract'>*/}
                            {/*                        <p>Like</p>*/}
                            {/*                        <p>Reply</p>*/}

                            {/*                    </div>*/}

                            {/*                </div>*/}
                            {/*            )*/}
                            {/*        }*/}
                            {/*    )*/}
                            {/*}*/}
                        </div>

                    )
                })

                }
            </div>
        </div>
    );
}