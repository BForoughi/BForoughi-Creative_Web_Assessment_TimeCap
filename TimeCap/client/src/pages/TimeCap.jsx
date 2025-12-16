import '../stylesheets/App.css'
import HeaderCard from '../components/HeaderCard'

function TimeCap(){
    return(
        <>
        {/* USE CLOUDINARYS UPLOAD WIDGET FOR YOU IMAGE UPLOADS */}
            <h1>TimeCap</h1>

            <HeaderCard id="card-purple" title="Locked Capsules">
                <div className="card-header">
                    <h3>ICON</h3>
                    <h3>Active</h3>
                </div>
                <h1>3</h1>
            </HeaderCard>

            <HeaderCard id="card-pink" title="Ready to open">
                <div className="card-header">
                    <h3>ICON</h3>
                    <h3>Ready</h3>
                </div>
                <h1>2</h1>
            </HeaderCard>
        </>
    )
}

export default TimeCap