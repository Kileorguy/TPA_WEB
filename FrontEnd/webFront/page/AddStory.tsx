import './styles/addStory.css'
import {useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {Create_Photo_Story, Create_Text_Story} from "../query/storyQuery.ts";
import {getDownloadURL, uploadBytes} from "firebase/storage";
import {GetReelsRef, GetStoryRef} from "../firebase/init.ts";

export default function AddStory() {
    const [background, setBackground] = useState<string>("black")
    const [text, setText] = useState<string>("")
    const [file, setFile] = useState<File>()
    const [textColor, setTextColor] = useState<string>("white")

    const [CreateTextStory] = useMutation(Create_Text_Story)
    const [CreatePhotoStory] = useMutation(Create_Photo_Story)

    return (
        <div className='addStoryOuter'>
            <div className='leftAddStory'>
                <div className='leftUpper'>
                    <h1>Add Photo Story</h1>
                    <input type="file" onChange={(event)=>{
                        setFile(event.target.files?.[0])
                    }}/>
                    <button onClick={async() => {
                        if(file) {
                            await uploadBytes(GetStoryRef(file?.name),file).then(async()=>{
                                    console.log("Upload Story")
                                    const link = await getDownloadURL(GetStoryRef(file?.name))
                                    console.log(link)

                                    await CreatePhotoStory({
                                        variables:{
                                            "photoStory": {
                                                "link": link
                                            }
                                        }
                                    })


                                }
                            )
                        }
                    }}>Submit
                    </button>
                </div>
                <div className='leftBottom'>
                    <h1>Add Text Story</h1>
                    <select name="" id="" value={background} onChange={(event) => {
                        setBackground(event.target.value)
                    }}>
                        <option value="black">Dark</option>
                        <option value="white">Light</option>
                    </select>
                    <input type="text" placeholder='Text' onChange={(event) => {
                        setText(event.target.value)
                    }}/>
                    <input type="text" placeholder='Color Hex' onChange={(event) => {
                        setTextColor(event.target.value)
                    }}/>
                    <button onClick={async() => {
                        await CreateTextStory({
                            variables:{
                                "textStory": {
                                    "text": text,
                                    "textColor": textColor,
                                    "backgroundColor": background
                                }
                            }
                        })
                    }}>Submit
                    </button>
                </div>
            </div>
            <div className='rightAddStory'>
                <div style={{backgroundColor : background}} className='story'>
                    <p id='storyText' style={{color : textColor}}>{text}</p>
                </div>
            </div>
        </div>
    )
}