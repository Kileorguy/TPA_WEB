import styles from './login.module.scss'
import './styles/register.css'
import {Link} from "react-router-dom";
import {useState} from "react";
import {useMutation} from "@apollo/client";
import {Create_User} from "../mutation/createUser.ts";



export default function Register(){
    const [firstName, setFirstName] = useState<string>("")
    const [surname, setSurname] = useState<string>("")
    const [dob, setDOB] = useState<string>("01")
    const [dob1, setDOB1] = useState<string>("01")
    const [dob2, setDOB2] = useState<string>("2023")

    const [gender, setGender] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [createUser] = useMutation(Create_User)

    const [error, setError] = useState<string>("")

    const handleForm = (e : any) =>{
        // setDOB(String(dob).padStart(2,'0'))
        // setDOB1(String(dob1).padStart(2,'0'))
        // setDOB2(String(dob2).padStart(4,'0'))
        const DOBB = `${dob2}-${dob1}-${dob}T00:00:00.000000000Z`
        e.preventDefault()
        console.log(firstName,surname,DOBB,gender,email,password)

        if(firstName == "" || surname == "" || DOBB == "" || gender == "" || email == "" || password == ""){
            setError("Fields must be filled!")
            return
        }else if(!email.includes("@")){
            setError("Input a valid email!")
            return
        }else if(password.length < 5){
            setError("Password must be atleast 5 characters")
            return
        }else if(password.includes(firstName) || password.includes(surname)){
            setError("Password must not contain your name")
            return
        }
        setError("Account success!")

        console.log("raw")
        console.log(email)
        createUser({
            variables:{
                input: {
                    "firstName": firstName,
                    "surname": surname,
                    "email": email,
                    "password": password,
                    "DOB": DOBB,
                    "gender": gender,
                    "role": "User"
                }
            }
        }).catch(
            (e:any)=>{
                let hehe = e.message
                if(hehe.includes('violates unique')){
                    console.log("Email already exist!")
                }else{
                }
                console.log(e.message)
            }
        )
    }
    return(
        <div className='outerLog'>
            <div className={styles.container}>
                <div className='left'>
                    <h1>FaREbook</h1>
                </div>
                <div className='right'>
                    <div className={styles.formLogin}>
                        <form className={styles.form} onSubmit={(event)=>{
                            handleForm(event)
                        }}>
                            <div className='inside'>
                                <input className={styles.splitForm} type="text" placeholder='First Name' onChange={e =>setFirstName(e.target.value)}/>
                                <input className={styles.splitForm} type="text" placeholder='Surname' onChange={e =>setSurname(e.target.value)}/>

                            </div>
                            <input className={styles.input} type="text" placeholder='Email Address' onChange={e =>setEmail(e.target.value)}/>
                            <input className={styles.input} type="password" placeholder='Password' onChange={e => setPassword(e.target.value)}/>
                            Date of birth
                            <div className='inside'>
                                <select value='1' className={styles.input2} onChange={e =>{setDOB(e.target.value)}}>
                                    {Array.from({length : 31},(_,i) =>(
                                        <option value={i+1}>{i+1}</option>
                                    ))}

                                </select>
                                <select value='1' className={styles.input2} onChange={e =>{setDOB1(e.target.value)}}>
                                    {Array.from({length : 12},(_,i) =>(
                                        <option value={i+1}>{i+1}</option>
                                    ))}

                                </select>
                                <select value='2023' className={styles.input2} onChange={e =>{setDOB2(e.target.value)}}>
                                    {Array.from({length : 100},(_,i) =>(
                                        <option value={2023-i}>{2023-i}</option>
                                    ))}

                                </select>
                            </div>
                            Gender
                            <div className='inside'>
                                <div className={styles.splitForm}>
                                    <input type="radio" name='gender' value='Male' onChange={e =>setGender(e.target.value)}/> Male<br/>
                                </div>
                                <div className={styles.splitForm}>
                                    <input type="radio" name='gender' value='Female' onChange={e =>setGender(e.target.value)}/> Female <br/>
                                </div>
                            </div>
                            <button type="submit"> Register </button>
                            {error}
                            <br/>
                            <Link to='/login' className={styles.link}>
                                <button> Already Have Account?</button>

                            </Link>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
