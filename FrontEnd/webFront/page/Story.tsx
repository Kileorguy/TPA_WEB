import './styles/story.css'
import {useMutation, useQuery} from "@apollo/client";
import {Get_Friend_Stories, Validate_Story} from "../query/storyQuery.ts";
import {useEffect, useState} from "react";
import {wait} from "@apollo/client/testing";
export default function Story(){
    const [idx, setIdx] = useState(0)
    const [stories, setStories] = useState()
    const [ValStory] = useMutation(Validate_Story)
    const {data : storiesData} = useQuery(Get_Friend_Stories)

    function nextIdx() {
        console.log(idx)
        setIdx((idx + 1) % (stories ? stories.length : 1))
        console.log(stories && stories[idx])
    }

    useEffect(()=>{
        setTimeout(() => {
            nextIdx()
        }, 5000)
    },[idx])

    function prevIdx(event) {
        console.log(idx)
        console.log(stories[idx])
        event.preventDefault()
        let size = 0
        if (stories) {
            size = stories.length
        } else {
            size = 0
        }
        setIdx(idx <= 0 ? size - 1 : idx - 1)
    }

    async function runOnce(){
        await ValStory()
        await wait(1000)
        console.log("TIMEr")
    }

    async function Wait(){
        // await wait(2000)
        // setTimeout(() => {
        //     nextIdx()
        // }, 3000)
    }
    useEffect(()=>{
        if(stories){
            Wait()
            nextIdx()

        }
    },[stories])
    useEffect(()=>{
        if(storiesData){
            setStories(storiesData.getFriendsStories)

        }
    },[storiesData])

    useEffect(()=>{
        runOnce()
    },[])

    return(
        <div className='storyOuter'>
            <div className='storyLeft'>
                <h1>Story</h1>
                <button onClick={()=>{
                    window.location.href = 'addStory'
                }}>Make Story</button>

                <div className='flex'>

                    <button onClick={prevIdx}>Prev</button>
                    <button onClick={nextIdx}>Next</button>
                </div>

            </div>
            <div className='storyRight'>
                <div style={{backgroundColor : stories && stories[idx] && stories[idx].backgroundColor}} className='story'>
                    {stories && stories[idx] && stories[idx].text &&
                        <p id='storyText'
                           style={{color: stories && stories[idx] && stories[idx].textColor}}>
                            {stories && stories[idx] && stories[idx]?.text}
                        </p>}
                    {
                        stories && stories[idx] && stories[idx].link &&
                        <img id='storyImg' src={stories[idx].link} alt=""/>
                    }
                </div>
            </div>
        </div>
    )
}