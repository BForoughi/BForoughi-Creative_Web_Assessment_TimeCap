import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext()

export function AuthProvider ({ children }){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // use effect runs after a render
    useEffect(()=> {
        const checkSession = async () => {
            try{
                const res = await axios.get('/api/auth/check', {withCredentials: true})
                setUser(res.data.user)
            } catch{
                setUser(null)
            } finally{
                setLoading(false)
            }
        }
        checkSession()
    }, [])

    return(
        <AuthContext.Provider value={{user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}

