import './styles/home.css'
import './styles/postModal.css'
import {MdOutlineFeed, MdWebStories} from "react-icons/md";
import {FaClapperboard} from "react-icons/fa6";
import {BsPeople} from "react-icons/bs";
import {BiGroup, BiVideo} from "react-icons/bi";
import {LuStore} from "react-icons/lu";
import {AiFillLike, AiOutlinePicture} from "react-icons/ai";
import {CiSaveDown1} from "react-icons/ci";
import {Link} from "react-router-dom";
import {FaShare} from "react-icons/fa";
import {AuthContext} from "../context/AuthContext.tsx";
import {useContext, useEffect, useState} from "react";
import {Add_File, Delete_Post, Get_All_Post, Upload_Post} from "../query/postQueries.ts";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {Add_Post_Like, Get_Post_Like} from "../query/likeQueries.ts";
import {Add_Comment, Add_Reply} from "../query/commentQuery.ts";
import Footer from "./components/Footer.tsx";
import {getDownloadURL, uploadBytes} from "firebase/storage";
import {GetPostPictRef} from "../firebase/init.ts";
import RichText from "./components/richText.tsx";


export default function Home() {

    const {picturePath, user} = useContext(AuthContext)
    const [posts, setPosts] = useState<any>()
    const [postText, setPostText] = useState<string>("")
    const [privacy, setPrivacy] = useState<string>("Public")
    const [postModal, setPostModal] = useState<boolean>(false)
    const [replyModal, setreplyModal] = useState<boolean>(false)
    const [uploadFiles, setUploadFiles] = useState<File>()
    const [tag,setTag] = useState<string>("")
    const [CreatePost] = useMutation(Upload_Post)
    const [commentInput, setCommentInput] = useState<string>("")
    const [getPostLike, {data: PostLike, refetch: getPostLikeRefetch}] = useLazyQuery(Get_Post_Like)
    const [replyText, setReplyText] = useState<string>("")
    const [currCommentId, setCurrCommentId] = useState<string>("")
    const [uploadLinks, setUploadLinks] = useState<string[]>([])
    // userCheck()
    const {data, refetch: refetchPost} = useQuery(Get_All_Post)
    const [AddPostLike] = useMutation(Add_Post_Like)
    const [addPostComment] = useMutation(Add_Comment)
    const [addReply] = useMutation(Add_Reply)
    const [addFile] = useMutation(Add_File)
    const [deleteThePost] = useMutation(Delete_Post)




    async function uploadFilePost(event) {

        event.preventDefault()
        if (uploadFiles != null) {
            console.log(uploadFiles.name)
            uploadBytes(GetPostPictRef(uploadFiles.name), uploadFiles).then(async () => {
                console.log("Uploaded")
                const link = await getDownloadURL(GetPostPictRef(uploadFiles.name))
                console.log(link)
                setUploadLinks([...uploadLinks, link])
                console.log(uploadLinks)
            })
        }
    }

    const [userIDReps,setUserIDReps] = useState<string>("")
    async function handleReplyUpload(event) {
        event.preventDefault()
        const splt = postText.split(">")
        const result = splt[0] + ">" +
            "<a href=\"/profile/"+userIDReps+"\"class=\"wysiwyg-mention\" data-mention=\"\">"+tag+"  </a>"+
            splt[1]+">"
        console.log(result)
        await addReply({
            variables: {
                "replyInput": {
                    "commentID": currCommentId,
                    "text": result
                }
            }
        })
    }

    async function LikePost(event, id: string) {
        event.preventDefault()
        await AddPostLike({
            variables: {
                "postID": id
            }
        })

    }

    useEffect(() => {
        console.log(data)
        console.log(data && data.getAllPost)
        if (data) {
            setPosts(data.getAllPost)

        }
    }, [data])
    const [postModalErr, setPostModalErr] = useState<string>("")

    async function handlePostUpload() {
        setTag("")
        if (postText == "") {
            setPostModalErr("Text must not be empty")
            return
        }
        console.log(privacy)
        console.log(postText)
        console.log(user.email)
        var id: string
        await CreatePost({
            variables: {
                postInput: {
                    "userID": user.email,
                    "privacy": privacy,
                    "text": postText,
                }
            }
        }).then(async (data) => {
            id = data.data.createPost.id
            console.log("LENNN", uploadLinks)
            for (let i = 0; i < uploadLinks.length; i++) {
                console.log(uploadLinks[i])
                await addFile({
                    variables: {
                        "file": uploadLinks[i],
                        "postID": id,
                    }
                })
            }
            setUploadLinks([])
            const dataNewPost = await refetchPost()
            setPosts(dataNewPost.data.getAllPost)
            setPostModal(false)
        })


    }

    async function addComment(id: string) {
        console.log(id, user.email, commentInput)
        await addPostComment({
            variables: {
                "commentInput": {
                    "postID": id,
                    "userID": user.email,
                    "text": commentInput,
                }
            }
        })

    }

    async function deletePost(event, id: string) {
        event.preventDefault()
        await deleteThePost({
            variables: {
                "postID": id
            }
        }).then(async () => {

            await refetchPost()
        })
    }


    return (
        <>

            {postModal && <div className="postModal">

                <div className='outerMakePost'>
                    <div className='mainComp'>
                        <div className='upper'>
                            <div className='profilePict'>
                                <img src={picturePath}/>
                            </div>
                            <div>
                                <p>Name</p>
                                <select name="" id="" value={privacy} onChange={(event) => {
                                    setPrivacy(event.target.value)
                                }}>
                                    <option value="Public">Public</option>
                                    <option value="CloseFriend">Teman Dekat</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>
                            <button className="postModalButton" onClick={() => {
                                setPostModal(false)
                                setUploadLinks([])
                            }}>Close
                            </button>
                        </div>
                        <div className='richText'>
                            <RichText  setText={setPostText}/>

                        </div>
                        <div className='others'>
                            <input type="file" onChange={(event) => {
                                setUploadFiles(event.target.files?.[0])
                            }}/>

                            {uploadFiles && <button onClick={uploadFilePost}>Add File</button>}
                        </div>
                        <div className='imgPreview'>
                            {uploadLinks && uploadLinks.map((fl: any) => {

                                return (
                                    <div className='fileInner'>
                                        {fl.includes('.jpg') && <img src={fl} alt=""/>}
                                        {fl.includes('.mp4') && <video controls autoPlay={true} src={fl}></video>}
                                        <button onClick={() => {
                                            setUploadLinks(uploadLinks.filter(item => item !== fl))
                                        }}>Remove
                                        </button>
                                    </div>

                                )

                            })}
                        </div>

                        <button
                            onClick={handlePostUpload}>{postModalErr && postModalErr} {!postModalErr && "Kirim"}</button>
                    </div>
                </div>

            </div>
            }

            {replyModal && <div className="postModal">

                <div className='outerMakePost'>
                    <div className='mainComp'>
                        <div className='upper'>
                            <div className='profilePict'>
                                <img src={picturePath}/>
                            </div>
                            <div>
                                <p>Name</p>
                                <select name="" id="" value={privacy} onChange={(event) => {

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
                        <div className='richText'>
                            <RichText setText={setPostText}/>

                        </div>
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
            <div className='mainContainer'>
                <div className='left'>
                    <div className='content'>
                        <div className='profilePict'>
                            <img src={picturePath}/>
                        </div>
                        <Link to={user && '/profile/' + user.id}>
                            <a href="">Profile</a>
                        </Link>
                    </div>

                    <div className='content'>
                        <BsPeople className='iconLeft'/>
                        <a href="/friend">Find Friends</a>
                    </div>
                    <div className='content'>
                        <MdOutlineFeed className='iconLeft'/>
                        <a href="">Feeds</a>
                    </div>
                    <div className='content'>
                        <BiGroup className='iconLeft'/>
                        <a href="">Groups</a>
                    </div>
                    <div className='content'>
                        <LuStore className='iconLeft'/>
                        <a href="">Marketplace</a>
                    </div>
                    <div className='content'>
                        <BiVideo className='iconLeft'/>

                        <a href="">Video</a>
                    </div>
                    <div className='content'>
                        <AiOutlinePicture className='iconLeft'/>

                        <a href="">Memories</a>
                    </div>
                    <div className='content'>
                        <CiSaveDown1 className='iconLeft'/>

                        <a href="">Saved</a>
                    </div>
                    <div id='line'></div>
                </div>

                <div className='mid'>

                    <div className='cardContainer'>
                        <div className='upperHome'>
                            <Link to='/story' className='redirect'>
                                <a>Stories</a>
                                <MdWebStories className='logo'/>
                            </Link>
                            <Link to='/addStory' className='redirect'>
                                <a>Create Story</a>
                                <MdWebStories className='logo'/>
                            </Link>
                            <Link to='/reels' className='redirect'>
                                <a>Reels</a>
                                <FaClapperboard className='logo1'/>
                            </Link>
                        </div>


                    </div>

                    <div className='cardContainer'>
                        <div className='insideCard'>
                            <div className='postPic1'>
                                <img src={picturePath}/>

                            </div>
                            <Link to={'/'} onClick={(event) => {
                                event.preventDefault()
                                setPostModalErr("")
                                setPostModal(true)
                            }} className='cardText'>
                                <p>What are you thinking about?</p>
                            </Link>
                        </div>

                    </div>
                    {
                        posts && posts.map((post: any) => {
                            if(post.groupID || post.groupID !=""){
                                return
                                (
                                    <>
                                    {/*<p>test</p>*/}
                                    </>
                                )
                            }
                            const files = post.files

                            const postUser: any = post.user
                            const comments: any[] = post.comments
                            // console.log(postUser&& postUser)
                            // console.log(user.email)


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

                                            {postUser && user && postUser.email == user.email &&
                                                <button onClick={(event) => {
                                                    deletePost(event, post.id)
                                                }}>Delete</button>
                                            }

                                        </div>
                                        <div className='content'>
                                            <p dangerouslySetInnerHTML={{
                                                __html : post.text
                                            }}></p>
                                        </div>
                                        <div className='fileContainer'>
                                            {files && files.map((fl: any) => {

                                                return (
                                                    <>
                                                        {fl.file.includes('.jpg') && <img src={fl.file} alt=""/>}
                                                        {fl.file.includes('.mp4') &&
                                                            <video controls autoPlay={true} src={fl.file}></video>}
                                                    </>

                                                )

                                            })}
                                        </div>
                                        <div id='line1'></div>

                                        <div className='interactPost'>
                                            <div className='interactItem' onClick={
                                                (event) => {
                                                    LikePost(event, post.id)
                                                    refetchPost()
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

                                                    {/*<div className='commentTemplate'>*/}
                                                    <input type='text' onKeyDown={(event) => {
                                                        // console.log(event.key)
                                                        if (event.key === "Enter") {
                                                            addComment(post.id)
                                                            setCommentInput("")
                                                        }

                                                    }} onChange={(event) => {
                                                        // console.log(event.target.value)
                                                        setCommentInput(event.target.value)

                                                    }} className='commentTemplate' placeholder='Write a comment...'/>

                                                    {/*</div>*/}
                                                </div>
                                            </div>
                                            Comment count : {post && post.commentCount}
                                            <button onClick={()=>{

                                            }}>Show Comment</button>
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
                                                                setTag("")
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
                                                                                        __html : r.text

                                                                                    }}></p>
                                                                                </div>
                                                                            </div>

                                                                            <div className='commentInteract'>
                                                                                <p>Like</p>
                                                                                <p onClick={()=>{

                                                                                    const tags = "@"+r.user.firstName + "_"+r.user.surname
                                                                                    setTag(tags)
                                                                                    setUserIDReps(r.user.id)
                                                                                    console.log("ID TEST",r.user.id)
                                                                                    setCurrCommentId(c && c.id)
                                                                                    setreplyModal(!replyModal)
                                                                                }}>Reply</p>

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
                    <Footer></Footer>

                </div>

                <div className='right'>

                </div>

            </div>
        </>
    )
}