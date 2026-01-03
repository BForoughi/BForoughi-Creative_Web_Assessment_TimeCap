import '../stylesheets/App.css'
import { Card } from 'react-bootstrap'
import UploadButton from '../components/UploadWidget'
import GerneralCard from '../components/GeneralCard'
import lockImg from "../assets/icons/lock.png"
import photosIcon from "../assets/icons/photosIcon.png"

function LockPage(){
    return(
        <>
        <div className="lock-header text-center">
            <h4>Create Time Capsule Album</h4>
            <p>Upload your photos, set a lock duration, and create a time capsule that will unlock your <br />
                memories in the future
            </p>
        </div>

        <div className="d-flex justify-between">
            <div id='lock-details' className="ms-5 me-5">
                <Card id='lock-card' className='shadow border border-light-subtle p-2 rounded-4'>
                    <Card.Body>
                        <Card.Title className='fw-normal fs-4'>Album Details</Card.Title>
                        <br />
                        <Card.Subtitle className='fw-light fs-5'>Album Name</Card.Subtitle>
                        <input type="text" placeholder='e.g., Summer Vacation 2025' className='form-control mt-2 ps-3 rounded-3'/>
                        <br />
                        <Card.Subtitle className='fw-light fs-5 mt-2'>Add a Message (Optial)</Card.Subtitle>
                        <input type="text" placeholder="Write a message to your future self..." className='form-control mt-2 ps-3 pb-5 rounded-3' />
                    </Card.Body>
                </Card>
                <br />
                <Card className='lock-card shadow border border-light-subtle p-2 mt-3 rounded-4'>
                    <Card.Body>
                        <div id="card-title-container" className='d-flex justify-content-between'>
                            <Card.Title className='fw-normal fs-4'>Upload Pictures</Card.Title> 
                            <p>0 Photos</p>   
                        </div>
                        <UploadButton></UploadButton>
                    </Card.Body>
                </Card>
            </div>

            <div id="lock-capsule">
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
                    <button className='duration-btns rounded-4 mb-3 pt-3 pb-3 fw-medium'>1 Month</button>
                    
                    <button className='duration-btns rounded-4 mb-3 pt-3 pb-3 fw-medium'>3 Months</button>
                    
                    <button className='duration-btns rounded-4 mb-3 pt-3 pb-3 fw-medium'>6 Months</button>

                    <button className='duration-btns rounded-4 pt-3 pb-3 fw-medium'>1 Year</button>
                    <hr />

                    <button id='pick-date' className='duration-btns rounded-4 mb-2 pt-3 pb-3 fw-medium'>Pick A Custom Date</button>
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
                            <p>0</p>
                            <p>3 Months</p>
                            <p>3 March, 2026</p>
                        </div>
                    </div>
                </GerneralCard>

            <button id='lock-capsule-btn' className='d-flex justify-content-center align-items-center gap-3 shadow border border-light-subtle p-3 fw-medium fs-4 rounded-4 mb-3'>
                <img src={lockImg} alt="Image of a small white padlock" id='lock-capsule-padlock'/>
                <span>Lock Time Capsule</span>
            </button>
            </div>

        </div>
        
    </>
    )
    
}

export default LockPage