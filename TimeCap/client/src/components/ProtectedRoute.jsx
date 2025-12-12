import { useEffect, useState } from "react";
import axios from 'axios'
import { Navigate } from "react-router-dom";

function ProtectedRoute({children}){
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() =>{
        const check = async () => {
            try {
                await axios.get('/api/auth/check', {withCredentials: true})
                setLoggedIn(true)
            } catch {
                setLoggedIn(false)
            } finally{
                setLoading(false)
            }
        }
        check()
    }, [])

    if(loading) return <div>Loading...</div>
    
    return loggedIn ? children : <Navigate to="/LoginForm" />
}

export default ProtectedRoute