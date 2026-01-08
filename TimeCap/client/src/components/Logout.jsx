import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/App.css"

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
        <button className="btn btn-danger w-100 mb-3 rounded-3" style={{height: "5vh"}} onClick={handleLogout}>Logout</button>
    )
    
}

export default LogoutButton