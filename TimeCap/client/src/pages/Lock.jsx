import '../stylesheets/App.css'
import { Card } from 'react-bootstrap'
import UploadButton from '../components/UploadWidget'
import GerneralCard from '../components/GeneralCard'

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
                    cardName="border border-light-subtle p-3 rounded-4"
                    cardTitleClass="fw-normal fs-4"
                    cardTitle="Lock Duration"
                    textClass=""
                    cardP="Choose how long your memories will be locked"
                    childrenClass="mt-2 ms-3 me-3"
                >
                    <button className='duration-btns rounded-4 mb-3 pt-3 pb-3'>1 Month</button>
                    
                    <button className='duration-btns rounded-4 mb-3 pt-3 pb-3'>3 Months</button>
                    
                    <button className='duration-btns rounded-4 mb-3 pt-3 pb-3'>6 Months</button>

                    <button className='duration-btns rounded-4 pt-3 pb-3'>1 Year</button>
                    <hr />

                    <button id='pick-date' className='duration-btns rounded-4 mb-2 pt-3 pb-3 fw-medium'>Pick A Custom Date</button>

                </GerneralCard>
            </div>


        </div>
        
    </>
    )
    
}

export default LockPage