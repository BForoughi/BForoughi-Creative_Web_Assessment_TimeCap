import { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

function LoginForm(){
    // Input fields
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    // Handlers to update states whenever the input changes
    const handleSubmit = async (e) =>{
        e.preventDefault() // prevents the browser reloading the page
        setError(null)
        // login api
        try{
            // sending login data to backend
            const res = await axios.post('/api/login', {
                username: username,
                password: password
            })

            // Handling the response to my data post
            if(res.data.success){
                // add a token
                console.log('login success')
                navigate('/TimeCap')
            }
        } catch(err){
            let errorMessage = 'login failed'
            if(err.res.data.message){
                errorMessage = err.res.data.message
            }
            console.log(err)
            setError(errorMessage)
        } 
    }


    return(
        <div className="login-container">
            <h2>Sign In</h2>
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

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm