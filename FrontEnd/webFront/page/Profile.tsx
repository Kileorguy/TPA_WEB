import './styles/profile.css'
import {useContext, useState} from "react";
import {GetProfilePictRef} from "../firebase/init.ts";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import {AuthContext} from "../context/AuthContext.tsx";
import {useMutation} from "@apollo/client";
import {AddOrUpdateProfile} from "../query/getUser.ts";
export default function Profile() {
    const {user,picturePath,refetch} = useContext(AuthContext)

    const [pict, setPict] = useState<any>()
    // let hehe  = localStorage.getItem("token")
    // let user = getProfile(hehe)

    const [upload] = useMutation(AddOrUpdateProfile)


    const change = async() =>{
        if(pict != null){
            console.log(pict.name)
            uploadBytes(GetProfilePictRef(pict.name),pict).then(async()=>{
                console.log("Uploaded")
                const link = await getDownloadURL(GetProfilePictRef(pict.name))
                console.log(link)
                await upload({
                    variables:{
                        link : link,
                        email : user.email
                    }
                })
                refetch()

            })
        }
    }
    // refetch()

    return (
        <>
            <div className='ProfileContainer'>
                <h1>
                    Profile Editor
                </h1>

                <div className='mainContainerr'>
                    <div className='profilePicture'>
                        <img src={picturePath}/>
                        <p>{user && user.firstName} {user && user.surname}</p>
                    </div>

                    <div className='addFile'>
                        <p>Edit Picture</p>
                        <input type="file" onChange={(e)=>{
                            setPict(e.target.files?.[0])
                            // console.log(e.target.value)
                        }}/>
                        <button type="button" onClick={ () =>{
                            change()
                        }}>Change</button>
                    </div>

                </div>


            </div>
        </>
    )
}