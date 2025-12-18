import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton(){
    const {setUser} = useAuth()
    const navigate = useNavigate()
    const [message, setMessage] = useState("")
    const handleLogout = async () => {
        try{
            const res = await axios.post("/api/logout", {}, {withCredentials: true})

            if(res.data.success){
                setUser(null)
                setMessage("Logout was successful")
                navigate("/", {state: {message: "Logout was successful!"}})
            } else{
                console.error("Logout failed", res.data.message)
                setMessage("Logout failed")
            }
        } catch(err){
            console.error("logout request failed", err)
            setMessage("Logout error")
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            {message && <p>{message}</p>}
        </div>
    )
    
}

export default LogoutButton