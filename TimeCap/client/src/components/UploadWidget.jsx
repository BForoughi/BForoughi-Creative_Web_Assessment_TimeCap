// Cloudinary upload widget with chatgpt used to convert their docs code into react function

function UploadButton(){
    const openWidget = () =>{
        if(!window.cloudinary){
            console.error("Cloudinary widget not loaded")
            return;
        }

        window.cloudinary.openUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                sources: [
                    "local",
                    "url",
                    "camera",
                    "image_search",
                    "google_drive"
                ],
                multiple: true,
                maxFileSize: 5 * 1024 * 1024,
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],
                maxImageWidth: 2000,
                maxImageHeight: 2000,
                quality: "auto",
                fetch_format: "auto",
            },
            (error, result) => {
                if (!error && result.event === "success") {
                    const imageUrl = result.info.secure_url
                    axios.post('/api/photos', { imageUrl }, { withCredentials: true });
                }
            }
        )
    }

    return <button onClick={openWidget}>Upload Image</button>
}

export default UploadButton