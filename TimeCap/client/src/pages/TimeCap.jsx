import '../stylesheets/App.css'
import HeaderCard from '../components/HeaderCard'
import LogoutButton from '../components/Logout'
import CapsuleCard from '../components/Capsules'
import GerneralCard from '../components/GeneralCard'
// icons
import whiteLock from "../assets/icons/whiteLock.png"
import unlock from "../assets/icons/unlock.png"
import whitePhotos from "../assets/icons/whitePhotos.png"
import quickLockImg from "../assets/icons/archive.png"
import lockImg from "../assets/icons/purpleLock.png"
// placeholder image: - image was created by chat gpt
import placeholderCover from "../assets/image/placeholderCover.png"

import { useEffect, useState, useMemo } from 'react'
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
    const [isDisabled, setIsDisabled] = useState(false)
    
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
                // the ? means if this exists otherwise return undefinded so the app doesn't crash
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
                <div className="col-12 col-md-5 col-lg-3 mb-1">
                    <HeaderCard id="card-purple" title="Locked Capsules">
                        <div className="card-header">
                            <img className='homeIcons' src={whiteLock} alt="" />
                            <h4 className='fw-normal'>Active</h4>
                        </div>
                        <h1 className='fw-normal'>{stats.lockedCount}</h1>
                    </HeaderCard>
                </div>

                <div className="col-12 col-md-5 col-lg-3 mb-2">
                    <HeaderCard id="card-pink" title="Ready to open">
                        <div className="card-header">
                            <img className='homeIcons' src={unlock} alt="" />
                            <h4 className='fw-normal'>Ready</h4>
                        </div>
                        <h1 className='fw-normal'>{stats.readyCount}</h1>
                    </HeaderCard>
                </div>

                <div className="col-12 col-md-5 col-lg-3 mb-1">
                    <HeaderCard id="card-blue" title="Total Photos">
                        <div className="card-header">
                            <img className='homeIcons' src={whitePhotos} alt="" />
                        </div>
                        <h1 className='fw-normal'>{stats.totalPhotos}</h1>
                    </HeaderCard>
                </div>
            </div>

            <h3 id='your-capsules' className='fw-normal mt-3'>Your Capsules</h3>
            
            <div className="d-flex justify-content-center">
                {/* displaying capsules if they exsist */}
                {sortedAlbums.length === 0 ?(
                    <div className="text-center p-4 rounded-4 shadow-sm bg-white">
                        <h4 className="fw-normal">No capsules yet</h4>
                        <p className="text-muted mb-0">
                            Create your first TimeCap album by uploading photos and locking a capsule.
                        </p>
                    </div>
                ) : (
                    <div className="row g-4 w-75">
                        {sortedAlbums.map((a) => (
                            <div className="col-12 col-md-6 col-xl-4" key={a._id}>
                            <CapsuleCard
                                title={a.title}
                                message={a.message}
                                photoCount={a.photoCount}
                                coverUrl={a.coverUrl}
                                isLocked={a.isLocked}
                                progress={a.progress}
                                daysRemaining={a.daysRemaining}
                            />
                            </div>
                        ))}

                        <div className="col-12 col-md-8 col-xl-4">
                            <GerneralCard
                                id="quick-lock-card" 
                                cardName="shadow border border-light-subtle p-4 rounded-4 mb-3"
                                imgId="quick-lock-icon"
                                cardIcon={quickLockImg}
                                cardTitleClass="fw-medium ms-3 mb-3 fs-4"
                                cardTitle="Create Time Capsule"
                                textClass="fs-5 fw-light"
                                cardP="Lock your memories and unlock them in the future."
                                childrenClass="mt-2 ms-3 me-3"
                            >
                                <div id="small-durations-container">
                                    <input className='form-control pt-2 pb-2 rounded-4' placeholder='Capsule name...' type="text" />
                                    <div className="row d-flex gap-4 justify-content-center mt-3">
                                        <button type='button' onClick="" className='duration-btns col-5 rounded-3 mb-3 pt-2 pb-2 fw-medium'>1 Month</button>
                                        <button type='button' onClick="" className='duration-btns col-5 rounded-3 mb-3 pt-2 pb-2 fw-medium'>3 Months</button>
                                    </div>
                                    <div className="row d-flex gap-4 justify-content-center">
                                        <button type='button' onClick="" className='duration-btns col-5 rounded-3 mb-3 pt-2 pb-2 fw-medium'>6 Months</button>
                                        <button type='button' onClick="" className='duration-btns col-5 rounded-3 mb-3 pt-2 pb-2 fw-medium'>1 Year</button>
                                    </div>

                                    <button 
                                        id='pick-date' 
                                        className='duration-btns rounded-4 mt-2 mb-2 pt-3 pb-3 fw-medium' 
                                        type='button'
                                        onClick={() => setIsDisabled(true)}
                                    >Pick A Custom Date</button>
                                    <hr />

                                    <button id='quick-lock-it' onClick={() => setIsDisabled(true)} className='rounded-4 mt-2 pt-3 pb-3 fw-medium'><img src={lockImg} alt="Image of a small white padlock" className='lock-capsule-padlock me-2 mb-1'/>
                                        Lock it!
                                    </button>
                                    {isDisabled ? (
                                        <p className="text-white fs-4 mt-2">
                                            Feature coming soon!
                                        </p>
                                    ) : (
                                        <p></p>
                                    )}
                                </div>
                            </GerneralCard>
                        </div>
                        
                    </div>
                )}
            </div>

            <br />

            <LogoutButton></LogoutButton>
        </>
    )
}

export default TimeCap