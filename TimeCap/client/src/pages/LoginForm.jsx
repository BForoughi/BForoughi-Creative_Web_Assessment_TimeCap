import { useState } from "react";
import axios from 'axios'; // axios is something I found from chatgpt as a better alternative to fetch as it ads automation
import {useNavigate, useLocation} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";



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
        <div className="login-container">
            <h2>Sign In</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <button type="submit">Login</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    )
}

export default LoginForm