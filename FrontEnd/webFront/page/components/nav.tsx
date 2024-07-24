import React, {useContext} from "react";
import {BsFacebook, BsMessenger} from "react-icons/bs"
import {AiFillHome} from "react-icons/ai"
import {FaUserFriends} from "react-icons/fa";
import './nav.css'
import {BiSolidGroup} from "react-icons/bi";
import {IoIosNotifications} from "react-icons/io";
import {Link} from "react-router-dom";
import {ImExit, ImSearch} from "react-icons/im";
import {AuthContext} from "../../context/AuthContext.tsx";


export default function Navbar({child} : {child : React.ReactNode}){
    const {picturePath, user, notifCount, changeTheme} = useContext(AuthContext)

    return (
        <>
            <nav>
                <div className='left'>
                    <Link to='/home'>
                        <BsFacebook className='icon'/>
                    </Link>
                </div>
                <div className='midContent'>
                    <Link to='/home'>
                        <AiFillHome className='iconMid'/>
                    </Link>
                    <Link to='/friend'>

                        <FaUserFriends className='iconMid1'/>
                    </Link>
                    <Link to='/group'>

                        <BiSolidGroup className='iconMid1'/>
                    </Link>
                    <Link to='/search'>
                        <ImSearch className='iconMid'/>
                    </Link>
                </div>
                <div className='rightNav'>
                    <button onClick={changeTheme}> Change Theme </button>
                    <Link to='/chat'>

                        <BsMessenger className='iconRight'/>
                    </Link>
                    <Link to='/Notif'>
                        <IoIosNotifications  className='iconRight1'/> {notifCount}
                    </Link>
                    <Link to={ user && '/profile/'+user.id} className='profilePict'>
                        <img src={picturePath}/>
                    </Link>
                    <ImExit className='iconRight1' onClick={()=>{
                        localStorage.setItem("token","")
                        window.location.href = '/login'
                    }}/>
                </div>
            </nav>
            <div className='gap'>

            </div>
            {child}
        </>
    )
}