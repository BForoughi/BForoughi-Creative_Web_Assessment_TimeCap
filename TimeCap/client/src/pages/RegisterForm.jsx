import { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { Container, Button } from "react-bootstrap";
import LogCard from "../components/logCard";
import "../stylesheets/App.css"

function RegisterForm(){
    // Input fields
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstname, setFirstname] = useState("")
    const [surname, setSurname] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError(null)

        // register api
        try{
            const data = { username, password, firstname, surname}
            const res = await axios.post('/api/register', data, {
                withCredentials: true
            })

            // Handling the response to my data post
            if(res.data.success){
                // add a token
                console.log('register success')
                navigate('/TimeCap')
            }
        } catch(err){
            const errorMessage = err.response
                ? err.response.data.message
                : 'Network or server connection error'
            setError(errorMessage)
        }
    }
    return(
        <LogCard 
            className="d-flex justify-content-center mt-5"
            cardName="log-card-styling p-5 rounded-4 border border-light-subtle"
            cardTitle="Register"
            titleClass="fs-2 text-center mb-4 fw-normal"
        >
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <input 
                                required
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="fs-5 rounded-3 p-2 mb-2 form-control"
                            />
                        </div>
                
                        <div className="col-6">
                        <input 
                                required
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="fs-5 rounded-3 p-2 form-control"
                            /> 
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <input
                                required 
                                type="text" 
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                placeholder="Firstname"
                                className="fs-5 rounded-3 p-2 form-control"
                            />
                        </div>

                        <div className="col-6">
                            <input 
                                required
                                type="text" 
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder="Surname"
                                className="fs-5 rounded-3 p-2 mb-3 form-control"
                            />
                        </div>
                    </div>             

                    {error && <p style={{color: 'red'}}>{error}</p>}

                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary btn-lg " type="submit">Sign Up</button>
                    </div>
                </div>
                
            </form>
        </LogCard>
    )
    
}

export default RegisterForm