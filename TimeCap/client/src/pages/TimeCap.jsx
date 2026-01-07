import '../stylesheets/App.css'
import HeaderCard from '../components/HeaderCard'
import LogoutButton from '../components/Logout'
// icons
import whiteLock from "../assets/icons/whiteLock.png"
import unlock from "../assets/icons/unlock.png"
import whitePhotos from "../assets/icons/whitePhotos.png"

import { useEffect, useState } from 'react'
import axios from 'axios'

function TimeCap(){
    const [stats, setStates] = useState({
        lockedCount: 0,
        readyCount:0,
        totalPhotos:0
    })
    const [error, setError] = useState("")

    useEffect(() => {
        const loadStats = async () => {
            try{
                const res = await axios.get("/api/dashboard/stats", {withCredentials: true})
                setStates(res.data.stats)
            } catch(err){
                setError(err?.response?.data?.data || "Failed to load stats")
            }
        }
        loadStats()
    }, [])

    return(
        <>
            {error && (
                <div className="alert alert-danger text-primary mt-3">
                    {error}
                </div>
            )}

            <div className="row d-flex justify-content-center mt-3">
                <div className="col-3">
                    <HeaderCard id="card-purple" title="Locked Capsules">
                        <div className="card-header">
                            <img className='homeIcons' src={whiteLock} alt="" />
                            <h4 className='fw-normal'>Active</h4>
                        </div>
                        <h1 className='fw-normal'>{stats.lockedCount}</h1>
                    </HeaderCard>
                </div>

                <div className="col-3">
                    <HeaderCard id="card-pink" title="Ready to open">
                        <div className="card-header">
                            <img className='homeIcons' src={unlock} alt="" />
                            <h4 className='fw-normal'>Ready</h4>
                        </div>
                        <h1 className='fw-normal'>{stats.readyCount}</h1>
                    </HeaderCard>
                </div>

                <div className="col-3">
                    <HeaderCard id="card-blue" title="Total Photos">
                        <div className="card-header">
                            <img className='homeIcons' src={whitePhotos} alt="" />
                        </div>
                        <h1 className='fw-normal'>{stats.totalPhotos}</h1>
                    </HeaderCard>
                </div>
            </div>

            

            

            <br />

            <LogoutButton></LogoutButton>
        </>
    )
}

export default TimeCap