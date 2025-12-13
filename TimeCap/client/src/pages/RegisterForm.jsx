import { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { Container, Button } from "react-bootstrap";

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
        <div className="register-container">
            <Container className="d-flex justify-content-center">
                <h2>Register</h2>
                <Button variant="light" onClick={() => navigate('/')}>Sign In</Button>
            </Container>
            
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
                <input 
                    type="text" 
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Firstname"
                />
                <input 
                    type="text" 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Surname"
                />

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
    
}

export default RegisterForm