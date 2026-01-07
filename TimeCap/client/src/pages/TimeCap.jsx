import '../stylesheets/App.css'
import HeaderCard from '../components/HeaderCard'
import LogoutButton from '../components/Logout'
import CapsuleCard from '../components/Capsules'
// icons
import whiteLock from "../assets/icons/whiteLock.png"
import unlock from "../assets/icons/unlock.png"
import whitePhotos from "../assets/icons/whitePhotos.png"
// placeholder image: - image was created by chat gpt
import placeholderCover from "../assets/image/placeholderCover"

import { useEffect, useState } from 'react'
import axios from 'axios'

// This section was created by chatgpt as I didn't know how to get the bootstrap progress bar to work with the data stored in mongo db
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function calcProgress(createdAt, lockedUntil) {
  if (!createdAt || !lockedUntil) return 0;
  const start = new Date(createdAt).getTime();
  const end = new Date(lockedUntil).getTime();
  const now = Date.now();
  if (!(end > start)) return 0;

  const total = end - start;
  const passed = clamp(now - start, 0, total);
  return Math.round((passed / total) * 100);
}

function calcDaysRemaining(lockedUntil) {
  if (!lockedUntil) return 0;
  const end = new Date(lockedUntil).getTime();
  const now = Date.now();
  const ms = end - now;
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}
// ---------end-------


function TimeCap(){
    // useStates:
    const [stats, setStates] = useState({
        lockedCount: 0,
        readyCount:0,
        totalPhotos:0
    })
    const [error, setError] = useState("")
    const [albums, setAlbums] = useState([])
    const [loading, setLoading] = useState(true)
    
    // useEffects:
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

    useEffect(() =>{
        const loadAlbums = async () => {
            setLoading(true)
            setError("")

            try{
                // fetching albums
                const res = await axios.get("/api/albums", {withCredentials: true})
                const baseAlbums = res.data.albums || []

                // if no albums exsist stop
                if (baseAlbums.length === 0){
                    setAlbums([])
                    return;
                }

                // fetching photos for each album
                const enriched = await Promise.all(
                    baseAlbums.map(async (a) =>{
                        try{
                            const photosRes = await axios.get(`/api/albums/${a._id}/photos`, {
                                withCredentials: true
                            })

                            const photos = photosRes.data.photos || []
                            const photoCount = photos.length

                            // first photo that has a real imageUrl from an unlocked only album
                            const firstVisible = photos.find((p) => p.imageUrl)
                            const coverUrl = firstVisible?.imageUrl || placeholderCover
                            
                            // chatgpt:
                            const progress = a.isLocked ? calcProgress(a.createdAt, a.lockedUntil) : 100;
                            const daysRemaining = a.isLocked ? calcDaysRemaining(a.lockedUntil) : 0;

                            return{
                                ...a,
                                photoCount: 0,
                                coverUrl: placeholderCover,
                                progress: a.isLocked ? calcProgress(a.createdAt, a.lockedUntil) : 100,
                                daysRemaining: a.isLocked ? calcDaysRemaining(a.lockedUntil) : 0
                            }
                        } catch (err) {
                            // if photo fetch fails, still show the album card
                            return {
                                ...a,
                                photoCount: 0,
                                coverUrl: placeholderCover,
                                progress: a.isLocked ? calcProgress(a.createdAt, a.lockedUntil) : 100,
                                daysRemaining: a.isLocked ? calcDaysRemaining(a.lockedUntil) : 0
                            }
                        }
                    }) 
                )

                setAlbums(enriched)
            } catch(err){
                setError(err?.response?.data?.message || "Failed to load albums")
            } finally{
                setLoading(false)
            }
        }

        loadAlbums()
    }, [])

    // unlocked capsules first 
    const sortedAlbums = useMemo(() => {
        return [...albums].sort((a, b) => {
            if (a.isLocked === b.isLocked) return 0;
            return a.isLocked ? 1 : -1; // unlocked fisrt
        });
    }, [albums]);

    if (loading) return <div className="container mt-4">Loading...</div>;

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

            <h3 className='fw-normal'>Your Capsules</h3>
            

            

            <br />

            <LogoutButton></LogoutButton>
        </>
    )
}

export default TimeCap