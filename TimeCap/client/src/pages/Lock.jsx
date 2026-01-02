import '../stylesheets/App.css'
import { Card } from 'react-bootstrap'
import UploadButton from '../components/UploadWidget'

function LockPage(){
    return(
        <>
        <div className="lock-header text-center">
            <h4>Create Time Capsule Album</h4>
            <p>Upload your photos, set a lock duration, and create a time capsule that will unlock your <br />
                memories in the future
            </p>
        </div>

        <div className="lock-details ms-5">
            <Card className='lock-card shadow border border-light-subtle p-2 rounded-4'>
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
    </>
    )
    
}

export default LockPage