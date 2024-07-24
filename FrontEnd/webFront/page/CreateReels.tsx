import './styles/reels.css'
import {useEffect, useState} from "react";
import {getDownloadURL, uploadBytes} from "firebase/storage";
import {GetReelsRef} from "../firebase/init.ts";
import {useMutation, useQuery} from "@apollo/client";
import {Add_Reels_Comment, Create_Reels, Delete_Self_Reels, Get_Self_Reels} from "../mutation/reelsQueries.ts";
export default function CreateReels(){
    const [file, setFile] = useState<File>()
    const [error,setError] = useState("")
    const [selfReels, setSelf] = useState()
    const [CreateReels] = useMutation(Create_Reels)
    const [text,setText] = useState<string>("")
    const {data, refetch} = useQuery(Get_Self_Reels)
    const [DeleteReels] = useMutation(Delete_Self_Reels)

    useEffect(()=>{
        console.log(data && data.getSelfReels)
        setSelf(data && data.getSelfReels)
    },[data])
    async function deleteReels(event){
        event.preventDefault()
        await DeleteReels()
        await refetch()
    }
    async function handleUpload(event : any){
        setError("")
        event.preventDefault()
        console.log("Uploading...")
        if (text == "") {
            setError("Text Must Be Filled!")
            return

        }
        if(file){
            const videoElement = document.createElement("video");

            videoElement.src = URL.createObjectURL(file);
            // console.log(videoElement.duration)
            videoElement.onloadedmetadata = async function(){

                console.log(videoElement.duration)

                if(videoElement.duration<1 || videoElement.duration>60){
                    setError("Invalid Duration")
                    console.log(videoElement.duration)
                    return
                }



                await uploadBytes(GetReelsRef(file?.name),file).then(async()=>{
                        console.log("Upload Reels")
                        const link = await getDownloadURL(GetReelsRef(file?.name))


                        await CreateReels({
                            variables:{
                                "inputLink" : link,
                                "text" : text
                            }
                        })

                        await refetch()
                    }
                )

            }

        }


    }

    return(
        <div className='ReelsOuter'>
            <div className='leftReels'>
                <input type="file" onChange={(event) => {
                    event.preventDefault()
                    setFile(event.target.files?.[0])
                }}/>
                <input type="text" onChange={(event)=>{
                    setText(event.target.value)
                }}/>
                <button onClick={handleUpload}>Upload</button>
                {error}
                <h1>{selfReels && selfReels.Text}</h1>
            </div>

            <div className='midReels'>
                <video controls autoPlay={true} loop src={selfReels && selfReels.Link}></video>
                <button onClick={deleteReels}>Delete</button>
            </div>


        </div>
    )
}