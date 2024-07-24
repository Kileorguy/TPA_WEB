import './App.css'
// import Login from "../page/Login.tsx";
import Register from "../page/Register.tsx";
import {Route, Routes} from "react-router-dom";
import Login from "../page/Login.tsx";
import Home from "../page/Home.tsx";
import Navbar from "../page/components/nav.tsx";

import Middleware from "../middleware/middleware.tsx";
import RevMiddleware from "../middleware/revMiddleware.tsx";
import Profile from "../page/Profile.tsx";
import Friends from "../page/Friends.tsx";
import Reels from "../page/Reels.tsx";
import Search from "../page/Search.tsx";
import UserProfile from "../page/UserProfile.tsx";
import Story from "../page/Story.tsx";
import AddStory from "../page/AddStory.tsx";
import Chat from "../page/Chat.tsx";
import CreateReels from "../page/CreateReels.tsx";
import Notif from "../page/Notif.tsx";
import Group from "../page/Group.tsx";
import CreateGroup from "../page/CreateGroup.tsx";
import GroupProfile from "../page/GroupProfile.tsx";

// import {useMutation, useQuery} from "@apollo/client";
// import {Get_User} from "../query/getUser.ts";
// import {Create_User} from "../mutation/createUser.ts";

function App() {
    // const n = useNavigate()

    // const{loading, error, data} = useQuery(Get_User)
    // console.log(loading,error,data)
    // const[createUser] = useMutation(Create_User)
    // createUser({
    //     variables:{
    //         input: {
    //             "name": "Rober",
    //             "password": "rober123",
    //             "role": "User"
    //         }
    //     }
    // })
    //
    // Middleware()


    return (
        <>
            <Routes>
                <Route path='/' element={
                    <RevMiddleware>
                        <Login/>
                    </RevMiddleware>

                }/>
                    <Route path='login' element={
                        <RevMiddleware>
                            <Login/>
                        </RevMiddleware>


                    }/>

                <Route path='register' element={
                    <RevMiddleware>
                        <Register/>
                    </RevMiddleware>


                }/>
                <Route path='home' element={<Navbar child={
                    <Middleware>
                        <Home/>
                    </Middleware>

                }/>}/>

                <Route path='profile' element={<Navbar child={
                    <Middleware>
                        <Profile/>
                    </Middleware>

                }/>}/>
                <Route path='friend' element={<Navbar child={
                    <Middleware>
                        <Friends/>
                    </Middleware>

                }/>}/>
                <Route path='reels' element={<Navbar child={
                    <Middleware>
                        <Reels/>
                    </Middleware>

                }/>}/>
                <Route path='search/:sc' element={<Navbar child={
                    <Middleware>
                        <Search/>
                    </Middleware>

                }/>}/>
                <Route path='search' element={<Navbar child={
                    <Middleware>
                        <Search/>
                    </Middleware>

                }/>}/>
                <Route path='userProfile' element={<Navbar child={
                    <Middleware>
                        <UserProfile/>
                    </Middleware>

                }/>}/>

                <Route path='profile/:id' element={<Navbar child={
                    <Middleware>
                        <UserProfile/>
                    </Middleware>

                }/>}/>
                <Route path='story' element={<Navbar child={
                    <Middleware>
                        <Story/>
                    </Middleware>

                }/>}/>
                <Route path='addStory' element={<Navbar child={
                    <Middleware>
                        <AddStory/>
                    </Middleware>

                }/>}/>
                <Route path='chat' element={<Navbar child={
                    <Middleware>
                        <Chat/>
                    </Middleware>

                }/>}/>
                <Route path='createReels' element={<Navbar child={
                    <Middleware>
                        <CreateReels/>
                    </Middleware>

                }/>}/>
                <Route path='notif' element={<Navbar child={
                    <Middleware>
                        <Notif/>
                    </Middleware>

                }/>}/>

                <Route path='group' element={<Navbar child={
                    <Middleware>
                        <Group/>
                    </Middleware>

                }/>}/>
                <Route path='profileGroup/:id' element={<Navbar child={
                    <Middleware>
                        <GroupProfile/>
                    </Middleware>

                }/>}/>

                <Route path='createGroup' element={<Navbar child={
                    <Middleware>
                        <CreateGroup/>
                    </Middleware>

                }/>}/>
            </Routes>
        </>
    )
}

export default App
