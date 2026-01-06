import { useState } from "react";
import axios from 'axios'; // axios is something I found from chatgpt as a better alternative to fetch as it ads automation
import {useNavigate, useLocation} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import "../stylesheets/App.css"
import LogCard from "../components/logCard";



function LoginForm(){
    // Input fields
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate();
    const { setUser } = useAuth()

    const location = useLocation()
    const message = location.state?.message // recieved from the logout redirect
    
    // Handler to update states whenever the input changes
    const handleSubmit = async (e) =>{
        e.preventDefault() // prevents the browser reloading the page
        setError(null)
        // login api
        try{
            const data = {username, password}
            // sending login data to backend
            const res = await axios.post('/api/login', data, {
                withCredentials: true
            })

            // Handling the response to my data post
            if((res.data.success)){
                // add a token
                console.log('login success')
                setUser(res.data.user.username)
                navigate('/TimeCap')
            }
           
        } catch(err){
            const errorMessage = err.response
                ? err.response.data.message
                : 'Network or server connection error'
            //console.log(errorMessage)
            setError(errorMessage)
        } 
    }


    return(
        <LogCard 
            className="d-flex justify-content-center mt-5"
            cardName="log-card-styling p-5 rounded-4 border border-light-subtle"
            cardTitle="Sign In"
            titleClass="fs-2 text-center mb-4 fw-normal"
        >
            {message && (
                <div className="alert alert-light text-primary mt-3">
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="contanier">
                    <input 
                        required
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="fs-5 rounded-3 p-2 mb-2 form-control"
                    />
                    <input 
                        required
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="fs-5 rounded-3 p-2 mb-2 form-control"
                    />
                </div>
                

                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary btn-lg " type="submit">Login</button>
                </div>
                {error && (
                    <div className="alert alert-danger text-primary mt-3">
                        {error}
                    </div>
                )}
            </form>
        </LogCard>
    )
}

export default LoginForm