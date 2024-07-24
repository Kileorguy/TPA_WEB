import './styles/search.css'
import {useEffect, useState} from "react";
import {useLazyQuery, useMutation} from "@apollo/client";
import {Get_User_Email, Search_User} from "../query/getUser.ts";
import {Search_Post} from "../query/postQueries.ts";
import {AiFillLike} from "react-icons/ai";
import {FaShare} from "react-icons/fa";
import {Create_Friends} from "../query/friendQueries.ts";
import {Link, useParams} from "react-router-dom";

export default function Search() {
    const params = useParams()


    const [users, setUsers] = useState<any[]>()
    const [posts, setPosts] = useState<any[]>()
    const [text, setText] = useState("")
    const [getPeopleSearch, {data: user}] = useLazyQuery(Search_User)
    const [getPostsSearch, {data: post}] = useLazyQuery(Search_Post)
    const [addFriend] = useMutation(Create_Friends)
    const [filter, setFilter] = useState<string>("All")
    useEffect(() => {
        console.log("Param", params.sc)
        if (params.sc) {
            setFilter("Post")
            setText("#" + params.sc)

        }
    }, [])

    async function fetchSearch() {
        await getPeopleSearch({
            variables: {
                "search": text
            }
        })
        await getPostsSearch({
            variables: {
                "search": text
            }
        })
    }

    useEffect(() => {
        fetchSearch()
    }, [text])

    useEffect(() => {
        setPosts(post && post.getSearchedPost)
        setUsers(user && user.getUserSearch)
        // console.log(post && post.getSearchedPost)
        // console.log(user && user.getUserSearch)
    }, [user, post])

    return (
        <div className='searchOuter'>
            <div className='searchUpper'>
                <h1>Search</h1>
                <input value={text} onChange={(event) => {
                    setText(event.target.value)
                }} type="text"/>
                <select name="" id="" value={filter} onChange={(event) => {
                    setFilter(event.target.value)
                }}>
                    <option value="All">All</option>
                    <option value="People">People</option>
                    <option value="Group">Group</option>
                    <option value="Post">Post</option>

                </select>
            </div>

            <div className='searchResult'>
                <h1>People</h1>
                {
                    (filter == "People" || filter == "All") && users && users.map((r) => {
                        return (

                            <div className="FriendCard">
                                <Link to={"/profile/" + r.id}>
                                    <div className="friendProfile">

                                        <img src={r.profilePicture} alt=""/>
                                    </div>
                                </Link>
                                <p>{r.firstName} {r.surname}</p>
                                <button onClick={async (event) => {
                                    event.preventDefault()
                                    await addFriend({
                                        variables: {
                                            "friendEmail": r.email
                                        }
                                    })
                                }}> Add
                                </button>
                            </div>


                        )
                    })
                }
                <h1>Group</h1>
                <h1>Post</h1>
                {
                    (filter == "Post" || filter == "All") && posts && posts.map((post) => {
                        // console.log(p)
                        const postUser = post.user;
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
                                        <div className='interactItem'>
                                            <AiFillLike/>
                                            Like
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
                                        {
                                            <div className='comment'>
                                                <div className='insideComment'>
                                                    <div className='profilePict'>
                                                    </div>

                                                    <div className='commentContent'>
                                                        Name <br/> Comment
                                                    </div>
                                                </div>

                                                <div className='commentInteract'>
                                                    <p>Like</p>
                                                </div>
                                            </div>
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