import {Link} from "react-router-dom";
import './footer.css'
export default function Footer(){

    return(
        <div className='footerOuter'>
            <Link to='/profile'>
                Profile
            </Link>
            <Link to='/home'>
                Home
            </Link>
            <Link to='/chat'>
                Messenger
            </Link>
            <Link onClick={()=>{
                localStorage.setItem("token","")
            }} to='/login'>
                Logout
            </Link>
            <Link to='https://www.facebook.com/terms.php'>
                Terms and Condition
            </Link>
        </div>
    )

}