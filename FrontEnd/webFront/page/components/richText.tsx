import {Editor} from 'react-draft-wysiwyg'
import {useEffect, useState} from "react";
import {convertToRaw, EditorState} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useQuery} from "@apollo/client";
import {Get_User} from "../../query/getUser.ts";
import draftToHtml from 'draftjs-to-html';

export default function RichText({setText}) {
    const [editorState, setEditorState] =
        useState(EditorState.createEmpty())
    const [users, setUsers] = useState()


    const {data} = useQuery(Get_User)
    useEffect(() => {
        if (data) {
            console.log("USERSSS", data.getUser)
            const userList = data.getUser
            const arr = []
            for (let i = 0; i < userList.length; i++) {
                // console.log(i)
                const userData = {
                    "text": userList[i].firstName + "_" + userList[i].surname,
                    "value": userList[i].firstName + "_" + userList[i].surname,
                    "url": '/profile/' + userList[i].id
                }
                arr.push(userData)
            }
            console.log("ARR", arr)

            setUsers(arr)
        }
    }, [data])

    useEffect(() => {
        const rawState = convertToRaw(editorState.getCurrentContent())
        let markup = draftToHtml(rawState, {
            trigger: "#",
            separator: " ",
        })
        markup = markup.replace("#", "/search/")
        console.log(markup)
        setText(markup)
        // console.log(text)
    }, [editorState])

    return (
        <Editor

            editorState={editorState}
            onEditorStateChange={(editorState) => {
                setEditorState(editorState)
            }}
            toolbarStyle={{
                display: "none",
                backgroundColor: "transparent"
            }}
            mention={{
                separator: ' ',
                trigger: '@',
                suggestions:
                users
                ,
            }}
            hashtag={{
                separator: ' ',
                trigger: '#',
            }}


        />
    )

}