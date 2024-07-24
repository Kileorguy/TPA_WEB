import './styles/group.css'
import {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {Get_Group, Self_Group} from "../query/groupQueries.ts";
import {Create_Group_Request} from "../query/groupRequestQueries.ts";
export default function Group(){
    const [groups,setGroups] = useState()
    const [selfGroups,setSelfGroups] = useState()

    const [search, setSearch] = useState("")
    const {data : groupData} = useQuery(Get_Group)
    const {data:selfGroup} = useQuery(Self_Group)
    useEffect(()=>{
        if(selfGroup){
            console.log("self",selfGroup.getSelfGroups)
            setSelfGroups(selfGroup.getSelfGroups)
        }
    },[selfGroup])

    useEffect(()=>{
        if(groupData){
            // console.log("Groups",groupData.getAllGroup)
            setGroups(groupData.getAllGroup)

        }
    }, [groupData])

    return(
        <div className='groupOuter'>
            <div className='groupLeft'>
                <div>
                    <button onClick={()=>{window.location.href = '/createGroup'}}>Create Group</button>
                </div>
                <input onChange={(event)=>{
                    setSearch(event.target.value)
                }} placeholder='Filter'/>
                {
                    groups && groups.map((m)=>{
                        if(m.privacy == "Public"){
                            // console.log(m.privacy)
                            if(m.title.includes(search)){
                                return(
                                    <div onClick={()=>{
                                        window.location.href = '/profileGroup/'+m.id
                                    }} className='groupCard'>
                                        {m.title}
                                    </div>
                                )
                            }
                            if(search == ""){
                                return(
                                    <div onClick={()=>{
                                        window.location.href = '/profileGroup/'+m.id
                                    }} className='groupCard'>
                                        {m.title}
                                    </div>
                                )
                            }

                        }
                    })
                }


            </div>

            <div className='groupLeft'>
                <h3>Joined Groups</h3>
                {
                    selfGroups && selfGroups.map((g)=>{
                        // if(m.)
                        // console.log(m)
                        return(
                            <div onClick={()=>{
                                window.location.href = '/profileGroup/'+g.id
                            }} className='groupCard'>
                                {g.title}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}