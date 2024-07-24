import styles from './login.module.scss'
import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {useLazyQuery} from "@apollo/client";
import {Do_Login} from "../query/getUser.ts";
import {AuthContext} from "../context/AuthContext.tsx";


export default function Login() {
    const { login: ctxLogin } = useContext(AuthContext)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    
    const [log] = useLazyQuery(Do_Login)
    const n = useNavigate()
    const login = async (e: any) => {
        e.preventDefault()
        console.log(email)
        if (email != '' && password != '') {
            await log({
                variables: {
                    email: email,
                    password: password
                }
            }).then((data) => {
                    console.log(data)
                    const token = data.data.login
                    if (token != "") {
                        localStorage.setItem("token", token)
                        ctxLogin()
                        n('/home')
                    }


                }
            )


        }
    }
    return (
        <div className='outerLog'>
            <div className={styles.container}>
                <div className='left'>
                    <h1>FaREbook</h1>
                </div>
                <div className='right'>
                    <div className={styles.formLogin}>
                        <form className={styles.form} onSubmit={async (e) => {
                            await login(e)
                        }}>
                            <input className={styles.input} type="text" placeholder='Email address' onChange={(e) => {
                                setEmail(e.target.value)
                            }}/>
                            <input className={styles.input} type="password" placeholder='Password' onChange={(e) => {
                                setPassword(e.target.value)
                            }}/>


                            <button type="submit"> Login</button>
                            <a href="">Forgotten Password?</a>
                            <br/>
                            <Link to='/register' className={styles.link}>
                                <button> Create New Account</button>
                            </Link>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}