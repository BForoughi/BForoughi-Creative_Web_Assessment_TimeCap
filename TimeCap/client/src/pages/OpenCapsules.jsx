import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";

function OpenCapsules() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [album, setAlbum] = useState(null)
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadAlbum = async () => {
            setLoading(true)
            setError("")

            try {
                const res = await axios.get(`/api/albums/${id}/photos`, {
                    withCredentials: true
                })

                // safety: if album is locked, go back
                if (res.data.album.isLocked) {
                    navigate("/TimeCap", { replace: true })
                    return;
                }

                setAlbum(res.data.album);
                setPhotos(res.data.photos || [])
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load capsule")
            } finally {
                setLoading(false)
            }
        }

        loadAlbum()
    }, [id, navigate])

    if (loading) return <div className="container mt-4">Loading...</div>

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        )
    }

    if (!album) return null;

    return (
        <div className="container mt-4">
            {/* Album header */}
            <div className="mb-4">
                <h2 className="fw-medium mb-1">{album.title}</h2>
                {album.message && (
                    <p className="text-muted mb-0">{album.message}</p>
                )}
            </div>

            {/* Photo grid */} 
            <div className="row g-3">
                {photos.map((p) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={p._id}>
                        <Card className="shadow-sm rounded-4 overflow-hidden border-0">
                            <img
                                src={p.imageUrl}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: 220,
                                    objectFit: "cover",
                                }}
                                loading="lazy"
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OpenCapsules;