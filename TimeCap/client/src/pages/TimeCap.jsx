import '../stylesheets/App.css'
import HeaderCard from '../components/HeaderCard'

import LogoutButton from '../components/Logout'

function TimeCap(){
    return(
        <>
            <div className="row d-flex justify-content-center mt-3">
                <div className="col-3">
                    <HeaderCard id="card-purple" title="Locked Capsules">
                        <div className="card-header">
                            <h4>ICON</h4>
                            <h4 className='fw-normal'>Active</h4>
                        </div>
                        <h1 className='fw-normal'>3</h1>
                    </HeaderCard>
                </div>

                <div className="col-3">
                    <HeaderCard id="card-pink" title="Ready to open">
                        <div className="card-header">
                            <h4>ICON</h4>
                            <h4 className='fw-normal'>Ready</h4>
                        </div>
                        <h1 className='fw-normal'>2</h1>
                    </HeaderCard>
                </div>

                <div className="col-3">
                    <HeaderCard id="card-blue" title="Total Photos">
                        <div className="card-header">
                            <h4>ICON</h4>
                        </div>
                        <h1 className='fw-normal'>247</h1>
                    </HeaderCard>
                </div>
            </div>

            

            

            <br />

            <LogoutButton></LogoutButton>
        </>
    )
}

export default TimeCap