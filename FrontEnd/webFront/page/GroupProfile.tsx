import './styles/groupProfile.css'
import './styles/postModal.css'
import {disableExperimentalFragmentVariables, useMutation, useQuery} from "@apollo/client";
import {
    Create_Group_Member,
    Get_Group_Id,
    Get_Group_Role,
    Get_Post_Group,
    Kick_Member,
    Leave_Group, Promote_Member
} from "../query/groupQueries.ts";
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Get_Friends} from "../query/friendQueries.ts";
import RichText from "./components/richText.tsx";
import {getDownloadURL, uploadBytes} from "firebase/storage";
import {GetGroupPostRef, GetPostFileRef, GetPostPictRef, GetReelsRef} from "../firebase/init.ts";
import {Add_File, Create_Group_Post, Delete_Post, Upload_Post} from "../query/postQueries.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import {AiFillLike} from "react-icons/ai";
import {FaShare} from "react-icons/fa";
import {Add_Post_Like} from "../query/likeQueries.ts";
import {Add_Comment} from "../query/commentQuery.ts";
import {Accept_Group_Request, Create_Group_Request, Get_Group_Request} from "../query/groupRequestQueries.ts";
import {Add_Group_File, Get_Group_File, Update_File} from "../query/groupFilesQueries.ts";



export default function GroupProfile(){
    const {user} = useContext(AuthContext)
    const params = useParams()
    const {data : friendsData} = useQuery(Get_Friends)
    const [postText, setPostText] = useState<string>("")

    const[uploadFiles, setUploadFiles] = useState<File>()
    const [uploadLinks,setUploadLinks] = useState<string[]>([])
    const [group,setGroup] = useState()
    const [postModal, setPostModal] = useState(false)
    const [friends, setFriends] = useState<any[]>()
    const [posts, setPosts] = useState<any[]>()
    const [currCommentId, setCurrCommentId] = useState<string>("")
    const [deleteThePost] = useMutation(Delete_Post)
    const [addMember] = useMutation(Create_Group_Member)

    const [requestJoin] = useMutation(Create_Group_Request)
    const [acceptRequest] = useMutation(Accept_Group_Request)

    const [leaveGroup] = useMutation(Leave_Group)

    const [kickMember] = useMutation(Kick_Member)
    const [promoteAdmin] = useMutation(Promote_Member)

    const [addFileGroup] = useMutation(Add_Group_File)

    const [updateFile] = useMutation(Update_File)
    const {data : FileGroup, refetch : RefetchFile} = useQuery(Get_Group_File,{
        variables:{
            "groupID" : params.id
        }
    })
    const [groupFile, setGroupFile] = useState()
    const [uploadedFile, setUploadedFile] = useState<File>()

    useEffect(()=>{
        if(FileGroup){
            console.log("File Group",FileGroup.getGroupFiles)
            setGroupFile(FileGroup.getGroupFiles)
        }
    },[FileGroup])

    const {data : groupRequests} = useQuery(Get_Group_Request,{
        variables:{
            "groupID" : params.id
        }
    })

    const [requests, setRequests] = useState()
    useEffect(()=>{
        if(groupRequests){
            console.log("Reqsss",groupRequests.getGroupRequest)
            setRequests(groupRequests.getGroupRequest)
        }
    },[groupRequests])

    const {data : RoleData} = useQuery(Get_Group_Role,{
        variables:{
            "groupID" : params.id
        }
    })
    const [admin,setAdmin] = useState<string>()

    useEffect(()=>{
        if(RoleData){
            // console.log("ROLE",RoleData.getRoleByAuth.isAdmin)
            if(RoleData.getRoleByAuth.isAdmin){
                setAdmin("Admin")
            }else{
                setAdmin("Member")

            }
        }
    },[RoleData])
    async function inviteFriend(id : string) {
        await addMember({
            variables:{
                "groupMember": {
                    "groupID": params.id,
                    "userID": id,
                    "isAdmin": false
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

        })
    }
    const [AddPostLike] = useMutation(Add_Post_Like)

    async function LikePost(event, id: string) {
        event.preventDefault()
        await AddPostLike({
            variables: {
                "postID": id
            }
        })

    }
    const {data : postData} = useQuery(Get_Post_Group,{
        variables:{
            "groupID" : params.id
        }
    })
    const {data} = useQuery(Get_Group_Id,{
        variables:{
            "groupID" : params.id
        }
    })
    const [addPostComment] = useMutation(Add_Comment)
    const [commentInput, setCommentInput] = useState<string>("")


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

    useEffect(()=>{
        // setPosts()
        if(postData){
            setPosts(postData.getPostGroupID)
        }
    },[postData])

    async function uploadFilePost(event){
        event.preventDefault()
        if (uploadFiles != null) {
            uploadBytes(GetGroupPostRef(uploadFiles.name), uploadFiles).then(async () => {
                console.log("Uploaded")
                const link = await getDownloadURL(GetGroupPostRef(uploadFiles.name))
                console.log(link)
                setUploadLinks([...uploadLinks, link])
                console.log(uploadLinks)
            })
        }
    }
    const [CreatePost] = useMutation(Create_Group_Post)
    const [addFile] = useMutation(Add_File)
    const [postGId, setPostGId] = useState<string>("")

    async function handlePostUpload() {
        if (postText == "") {
            return
        }
        var id: string
        console.log("creating")
        await CreatePost({
            variables: {
                postInput: {
                    "userID": user.email,
                    "privacy": "Public",
                    "text": postText,
                },
                "groupID" :params.id
            }
        }).then(async (data) => {
            console.log("success")
            // console.log("DATAAAA",data.data)
            id = data.data.createPostGroup.id
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
            setPostModal(false)
        })


    }

    useEffect(()=>{
        if(friendsData){
            // console.log("friends",friendsData.getFriend)
            setFriends(friendsData.getFriend)

        }
    },[friendsData])
    useEffect(()=>{
        if(data){
            setGroup(data.getGroupID)
        }
    },[data])

    return(
        <div className='groupProfileOuter'>
            {postModal && <div className="postModal">

                <div className='outerMakePost'>
                    <div className='mainComp'>
                        <div className='upper'>

                            <button className="postModalButton" onClick={() => {
                                setPostModal(false)
                                // setUploadLinks([])
                            }}>Close
                            </button>
                        </div>
                        <div className='richText'>
                            <RichText setText={setPostText}/>


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
                                        {(fl.includes('.jpg')  || fl.includes('.png')|| fl.includes('.jpeg'))&& <img src={fl} alt=""/>}
                                        {fl.includes('.mp4') && <video controls autoPlay={true} src={fl}></video>}
                                        <button onClick={() => {
                                            setUploadLinks(uploadLinks.filter(item => item !== fl))
                                        }}>Remove
                                        </button>
                                    </div>

                                )

                            })}
                        </div>

                        <button onClick={()=>{
                            handlePostUpload()}}>Kirim</button>
                    </div>
                </div>

            </div>
            }
            <div className='mainGroupP'>
                <h1>{group && group.title}</h1>
                <h2>Privacy : {group && group.privacy}</h2>
                <div className='members'>
                    <div className='memberContainer'>
                        <h2>Admin</h2>
                        {group && group.admin.map((b)=>{
                            const a = b.user
                            return(
                                <div className='user'>
                                    <div className='userContain'>
                                        <img onClick={() => {
                                            window.location.href = '/profile/' + a.id
                                        }} src={a.profilePicture} alt="" id='profilePicture'/>

                                        <h2>
                                            {a.firstName} {a.surname}
                                        </h2>

                                    </div>
                                </div>
                            )
                            })
                            }
                    </div>
                    <div className='memberContainer'>
                        <h2>Member</h2>
                        {group && group.member.map((b)=>{
                            const a = b.user
                            return(
                                <div className='user'>
                                    <div className='userContain'>
                                        <img onClick={() => {
                                            window.location.href = '/profile/' + a.id
                                        }} src={a.profilePicture} alt="" id='profilePicture'/>

                                        <h2>
                                            {a.firstName} {a.surname}
                                        </h2>
                                        {
                                            admin && admin == "Admin" && <button onClick={async()=>{
                                                await promoteAdmin({
                                                    variables:{
                                                        "groupID" : params.id,
                                                        "userEmail" : a.email
                                                    }
                                                })
                                            }}>Promote</button>
                                        }
                                        {
                                            admin && admin == "Admin" && <button onClick={async()=>{
                                                await kickMember({
                                                    variables:{
                                                        "groupID" : params.id,
                                                        "userEmail" : a.email
                                                    }
                                                })
                                            }}>Remove</button>

                                        }

                                    </div>
                                </div>
                            )
                        })
                        }

                    </div>
                </div>
                <div className='Group Buttons'>
                    {admin && <button onClick={async()=>{
                        await leaveGroup({
                            variables:{
                                "groupID" : params.id
                            }
                        })
                    }}>Leave Group</button>}
                    {!admin && <button onClick={async()=>{
                        await requestJoin({
                            variables:{
                                "groupID" : params.id,
                                "userEmail" : user.email
                            }
                        })
                    }}>Request to Join</button>}


                </div>
            </div>
            <div className='addFriend'>
                <h1>Invite Friends</h1>
                {friends && friends.map((a)=>{
                    return(
                        <div className='user'>
                            <div className='userContain'>
                                <img onClick={() => {
                                    window.location.href = '/profile/' + a.id
                                }} src={a.profilePicture} alt="" id='profilePicture'/>

                                <h2>
                                    {a.firstName} {a.surname}
                                </h2>

                                <button onClick={()=>{
                                    inviteFriend(a.email)
                                }}>Add</button>
                            </div>
                        </div>
                    )
                })

                }
            </div>
            <div className='groupPost'>
                <button onClick={()=>{
                    setPostModal(true)
                    setPostGId(params.id)
                }}>Create Post</button>

                {
                    posts && posts.map((post: any) => {

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

                                        {((postUser && user && postUser.email == user.email) || (admin && admin == "Admin"))&&
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
                                                            // setreplyModal(!replyModal)
                                                            // console.log("Commenttt ", c.id)
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
                                                                                <br/> {r && r.text}
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

            <div className='addFriend'>
                <h1>Group Requests</h1>
                {
                    requests && requests.map((r)=>{
                        return(
                            <div className='flex'>
                                <p>{r.user.firstName} {r.user.surname}</p>
                                {admin && admin == "Admin" && <button onClick={async()=>{
                                    console.log(params.id)
                                    console.log(r.user.email)
                                    await acceptRequest({
                                        variables:{
                                            "groupID" : params.id,
                                            "userEmail" : r.user.email
                                        }
                                    })
                                }}>Accept</button>}
                            </div>
                        )
                    })
                }

            </div>

            <div className='addFriend'>
                <h1>Group Files</h1>
                <input type="file" onChange={(event)=>{
                    event.preventDefault()
                    setUploadedFile(event.target.files?.[0])
                }}/>

                <button onClick={async()=>{
                    if(uploadedFile) {

                        await addFileGroup({
                            variables: {
                                "groupID": params.id,
                                "link": "",
                                "fileName": uploadedFile.name
                            }
                        }).then(async(data)=>{
                            console.log(data.data.createGroupFiles)
                            const fetched = data.data.createGroupFiles
                            const filename = fetched.fileName
                            const idFile = fetched.id

                            await uploadBytes(GetPostFileRef(filename), uploadedFile).then(async () => {
                                    console.log("Upload Reels")
                                    const link = await getDownloadURL(GetPostFileRef(filename))
                                    await updateFile({variables:{
                                            "id" : idFile,
                                            "linkBaru" : link
                                        }})
                                }
                            )

                        })
                    }
                }}>Upload</button>

                {
                    groupFile && groupFile.map((g)=>{
                        console.log()
                        return(
                            <div className='flex'>
                                <p>{g.user.firstName} {g.user.surname}</p>
                                <a href={g.link} download>{g.fileName}</a>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}