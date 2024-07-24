import './styles/createGroup.css'
import {useContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {Get_Friends} from "../query/friendQueries.ts";
import {Create_Group, Create_Group_Member} from "../query/groupQueries.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import {wait} from "@apollo/client/testing";
export default function CreateGroup(){
    const {user} = useContext(AuthContext)
    const [title,setTitle] = useState<string>("")
    const [privacy, setPrivacy] = useState<string>("Public")
    const [friends,setFriends] = useState<any[]>()
    const {data} = useQuery(Get_Friends)
    const [selIds, setSelIds] = useState<string[]>()
    var selectedId : string[] = []
    const [err,setErr] = useState("")
    const [createGroup, {data : groupData}] = useMutation(Create_Group)
    const [addGroupMember] = useMutation(Create_Group_Member)
    const [groupId, setGroupID] = useState<string>("")
    useEffect(()=>{
        if(data){
            console.log(data.getFriend)
            setFriends(data.getFriend)

        }
    },[data])
    async function addMember(id : string){
        console.log("IDD",id)
        console.log("Selected ID",selIds)
            console.log("UserID",user.id)
        if(selIds){
            var idss:string[] = selIds

            for (let i = 0; i <  idss.length; i++) {
                console.log(idss[i])
                console.log(id)
                await addGroupMember({
                    variables: {
                        "groupMember": {
                            "groupID": id,
                            "userID": idss[i],
                            "isAdmin": false,
                        }
                    }
                })
                console.log("Add Success")
            }
        }
            await addGroupMember({
                variables:{
                    "groupMember":{
                        "groupID" : id,
                        "userID" : user.email,
                        "isAdmin" : true,
                    }
                }
            })
    }
    useEffect(()=>{
        if(groupData){
            console.log(groupData.createGroup.id)
            setGroupID(groupData.createGroup.id)
            addMember(groupData.createGroup.id)

        }
    },[groupData])

    return(
        <div className='createGroupOuter'>
            <h1>Create Group</h1>
            <div className='createGroupContainer'>
                <div className='createGContent'>
                    <h3>Group Title</h3>
                    <input onChange={(event)=>{
                        setTitle(event.target.value)
                    }} type="text"/>
                </div>
                <div className='createGContent'>
                    <h3>Privacy</h3>
                    <select name="" id="" value={privacy} onChange={(event) => {
                        setPrivacy(event.target.value)
                    }}>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <div className='createGContent1'>
                    <h3>Select Friends</h3>
                    <div className='friendsContainer'>
                        {friends && friends.map((f)=>{

                                return(
                                    <div className='friendCard'>
                                        <div className='friendProfile'>
                                            <img src={f.profilePicture} alt=""/>
                                        </div>
                                        <p>{f.firstName} {f.surname}</p>
                                        {<button onClick={() => {
                                            if(selIds){
                                                selectedId = selIds
                                            }
                                            selectedId.push(f.email)

                                            // const filtered = friends?.filter((f)=>{
                                            //     if(!selectedId.includes(f.email)){
                                            //         return true
                                            //     }
                                            // })
                                            // setFriends(filtered)
                                            console.log(selectedId)
                                            setSelIds(selectedId)



                                        }} id='check'> Add </button>}

                                    </div>
                                )

                        }) }


                    </div>
                </div>
                <button onClick={async()=>{
                    if(title != "" && title) {
                        await createGroup({
                            variables:{
                                "title" : title,
                                "privacy" : privacy
                            }
                        })
                    }else {
                        console.log("error")
                        setErr("Title must be filled!")
                    }
                }}>Create Group</button>
                <p>{err}</p>
            </div>
        </div>
    )
}