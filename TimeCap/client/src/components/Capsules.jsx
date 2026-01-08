import { Card, ProgressBar, Badge } from "react-bootstrap";
import "../stylesheets/App.css"
import { Link } from "react-router-dom";

function CapsuleCard({
    id,
    title,
    message,
    photoCount,
    coverUrl,
    isLocked,
    progress,
    daysRemaining
}){

    const content = (
        <Card className="shadow-sm rounded-4 overflow-hidden capsule-card">
            <div className="position-relative">
                <Card.Img
                    src={coverUrl}
                    className={isLocked ? "capsule-img-blur" : ""}
                    style={{ height: "200px", objectFit: "cover" }}
                />

                <Badge
                    bg={isLocked ? "primary" : "success"}
                    className="position-absolute top-0 end-0 m-2 px-3 py-2 rounded-pill"
                >
                    {/* emoji from - https://emojipedia.org/unlocked*/}
                    {isLocked ? `${daysRemaining}d` : "🔓 Open"} 
                </Badge>

                {isLocked && (
                    // emoji from - https://emojipedia.org/locked
                <div className="position-absolute top-50 start-50 translate-middle bg-white rounded-3 p-3 shadow">
                    🔒 
                </div>
                )}
            </div>

            <Card.Body>
                <div className="d-flex justify-content-between">
                    <Card.Title>{title}</Card.Title>
                    {!isLocked && <span className="text-success">Unlocked!</span>}
                </div>

                {message && <Card.Text className="text-muted small">{message}</Card.Text>}
                {/* emoji taken from - https://emojipedia.org/camera */}
                <div className="text-muted small mb-2">📷 {photoCount} Photos</div> 

                {isLocked ? (
                <>
                    <div className="d-flex justify-content-between small">
                        <span>Time passed</span>
                        <span>{progress}%</span>
                    </div>
                    <ProgressBar now={progress} />
                </>
                ) : (
                    // emoji taken from - https://emojipedia.org/party-popper
                    <div className="text-primary fw-medium">Ready to open 🎉</div>
                )}
            </Card.Body>
        </Card>
    )

    if (isLocked) return content;
        
    return (
        <Link to={`/albums/${id}`} className="text-decoration-none text-reset">
            {content}
        </Link>
    );
}

export default CapsuleCard