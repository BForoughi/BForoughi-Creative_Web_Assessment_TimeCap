import '../stylesheets/App.css'
import { Card } from 'react-bootstrap'
import UploadButton from '../components/UploadWidget'
import GerneralCard from '../components/GeneralCard'
import lockImg from "../assets/icons/lock.png"
import photosIcon from "../assets/icons/photosIcon.png"
import { useState } from 'react'
import axios from 'axios'

function LockPage(){
    // -------------useStates--------------:
    // inputs
    const [albumName, setAlbumName] = useState("")
    const [message, setMessage] = useState("")

    const [albumId, setAlbumId] = useState(null)

    // preview states
    const [photoCount, setPhotoCount] = useState(0)
    const [durationLabel, setDurationLabel] = useState(null)
    const [lockForSeconds, setLockForSeconds] = useState(null)

    // custom date
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [customDate, setCustomDate] = useState("") 

    const unlockAt = customDate
        // unlocks at start of the chosen day 
        ? new Date(`${customDate}T00:00:00`).toISOString()
        : null

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    // adding an id if one doesn't already exist - suggestion from chat gpt as error handling
    const createAlbumIfNeeded = async () => {
        if (albumId) return albumId

        if (!albumName.trim()) {
            throw new Error("Please enter an album name first.")
        }

        const res = await axios.post("/api/albums", 
            {title: albumName, message},
            {withCredentials: true}
        )

        const newId = res.data.album._id
        setAlbumId(newId)
        return newId
    }

    // handles the preset duration buttons
    const handlePickDuration = (label, seconds) => {
        setDurationLabel(label)
        setLockForSeconds(seconds)
        // if user picks a preset duration, hide and clear custom date
        setShowDatePicker(false)
        setCustomDate("")
    }

    // used for if the user chooses to pick a custom date
    const handlePickCustomDate = () => {
        // switch to custom date mode
        setDurationLabel("Custom Date")
        setLockForSeconds(null)
        setShowDatePicker((v) => !v)
    }

    // taken from chat gpt as I wanted a UK format
    const formatUkDate = (isoDate) => {
        if (!isoDate) return "-";
        return new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(isoDate));
    };

    const handleLockCapsule = async () => {
        setError("")
        setSaving(true)

        try {
            // error handling
            if (!unlockAt && !lockForSeconds) {
                throw new Error("Pick a duration or choose a custom unlock date.")
            }

            if (photoCount < 1) {
                throw new Error("Upload at least 1 photo before locking.")
            }

            // getting the id from createAlbumIfNeeded function
            const id = await createAlbumIfNeeded()

            const body = unlockAt ? { unlockAt } : { lockForSeconds }

            const res = await axios.patch(`/api/albums/${id}/lock`, body, {withCredentials: true})

            console.log("Locked until:", res.data.lockedUntil)
            alert("Time capsule locked! 🔒"); // emoji taken from https://emojipedia.org/locked
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Something went wrong")
        } finally {
            setSaving(false)
        }
    };

    return(
        <>
        <div className="lock-header text-center">
            <h4>Create Time Capsule Album</h4>
            <p>Upload your photos, set a lock duration, and create a time capsule that will unlock your <br />
                memories in the future
            </p>
        </div>

        <div className="d-flex justify-between flex-column flex-lg-row">
            <div id='lock-details' className="ms-5 col-md-12 me-lg-5 responsive-width">
                <Card id='lock-card' className='shadow border border-light-subtle p-2 rounded-4 col-md-11 col-sm-12'>
                    <Card.Body>
                        <Card.Title className='fw-normal fs-4'>Album Details</Card.Title>
                        <br />
                        <Card.Subtitle className='fw-light fs-5'>Album Name</Card.Subtitle>
                        <input 
                            type="text" 
                            value={albumName}
                            onChange={(e) => setAlbumName(e.target.value)}
                            placeholder='e.g., Summer Vacation 2025' 
                            className='form-control mt-2 ps-3 rounded-3'
                        />
                        <br />
                        <Card.Subtitle className='fw-light fs-5 mt-2'>Add a Message (Optional)</Card.Subtitle>
                        <input 
                            type="text" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a message to your future self..." 
                            className='form-control mt-2 ps-3 pb-5 rounded-3' 
                        />
                    </Card.Body>
                </Card>
                <br />
                
                <Card className='lock-card shadow border border-light-subtle p-2 mt-3 rounded-4 col-md-11'>
                    <Card.Body>
                        <div id="card-title-container" className='d-flex justify-content-between'>
                            <Card.Title className='fw-normal fs-4'>Upload Pictures</Card.Title> 
                            <p>{photoCount} Photos</p>   
                        </div>

                        <UploadButton
                            albumId={albumId}
                            ensureAlbum={createAlbumIfNeeded}
                            onCountChange={setPhotoCount}
                            onError={(msg) => setError(msg)}
                        ></UploadButton>
                        {error && (
                            <div className="alert alert-danger text-primary mt-2">
                                {error}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <div id="lock-capsule" className='col-md-12 responsive-width'>
                <GerneralCard 
                    id="lock-duration-card" 
                    cardName="shadow border border-light-subtle p-4 rounded-4 mb-3"
                    imgId="duration-padlock"
                    cardIcon={lockImg}
                    cardTitleClass="fw-medium fs-4"
                    cardTitle="Lock Duration"
                    textClass="fs-5 fw-light"
                    cardP="Choose how long your memories will be locked"
                    childrenClass="mt-2 ms-3 me-3"
                >
                    {/* maths was taken by chat gpt */}
                    <button type='button' onClick={() => handlePickDuration("1 Month", 60 * 60 *24 * 30)} className='duration-btns rounded-4 mb-3 pt-3 pb-3 fw-medium'>1 Month</button>
                    
                    <button type='button' onClick={() => handlePickDuration("3 Months", 60 * 60 *24 * 90)} className='duration-btns rounded-4 mb-3 pt-3 pb-3 fw-medium'>3 Months</button>
                    
                    <button type='button' onClick={() => handlePickDuration("6 Months", 60 * 60 *24 * 180)} className='duration-btns rounded-4 mb-3 pt-3 pb-3 fw-medium'>6 Months</button>

                    <button type='button' onClick={() => handlePickDuration("1 Year", 60 * 60 *24 * 365)} className='duration-btns rounded-4 pt-3 pb-3 fw-medium'>1 Year</button>
                    <hr />

                    <button 
                        id='pick-date' 
                        className='duration-btns rounded-4 mb-2 pt-3 pb-3 fw-medium' 
                        type='button'
                        onClick={handlePickCustomDate}
                    >Pick A Custom Date</button>

                    {showDatePicker && (
                        <input
                            type="date"
                            className="form-control rounded-3"
                            value={customDate}
                            min={new Date().toISOString().slice(0, 10)} // prevents past dates
                            onChange={(e) => setCustomDate(e.target.value)}
                        />
                        )}
                </GerneralCard>

                <GerneralCard
                    id="preview-card"
                    cardName="shadow border border-light-subtle p-4 rounded-4 mb-3"
                    imgId="photos-icon"
                    cardIcon={photosIcon}
                    cardTitleClass="fw-medium fs-5"
                    cardTitle="Preview"
                    childrenClass=""
                >
                    <div className="row">
                        <div className="col-9">
                            <p>Photos:</p>
                            <p>Duration:</p>
                            <p>Unlock Date:</p>
                        </div>
                        <div className="col-3 fw-medium">
                            <p>{photoCount}</p>
                            <p>{durationLabel || "-"}</p>
                            <p>{unlockAt ? formatUkDate(unlockAt) : "-"}</p>
                        </div>
                    </div>
                </GerneralCard>

            <button 
                id='lock-capsule-btn' 
                type='button'
                disabled={saving}
                onClick={handleLockCapsule}
                className='d-flex justify-content-center align-items-center gap-3 shadow border border-light-subtle p-3 fw-medium fs-4 rounded-4 mb-3'
            >
                <img src={lockImg} alt="Image of a small white padlock" className='lock-capsule-padlock'/>
                <span>{saving ? "Locking..." : "Lock Time Capsule"}</span>
            </button>
            </div>

        </div>
        
    </>
    )
    
}

export default LockPage