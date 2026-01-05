// Cloudinary upload widget with chatgpt used to convert their docs code into react function as well check whether the user wants to confirm their upload, 
// as well as code for passing albumId through the widget
import axios from "axios";
import { useRef, useState } from "react";
import '../stylesheets/App.css'

function UploadButton({ albumId, ensureAlbum, onCountChange, onError }) {
  const uploadedRef = useRef([]); // store uploaded images temporarily
  const [showConfirm, setShowConfirm] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);

  const openWidget = async () => {
    try{
      const ensureAlbumId = albumId || (await ensureAlbum?.())
      if(!ensureAlbumId){
        onError?.("Please enter an album name first.")
        return;
      }
    
      if (!window.cloudinary) {
        console.error("Cloudinary widget not loaded");
        return;
      }

      setWidgetOpen(true);

      window.cloudinary.openUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera", "image_search", "google_drive"],
          multiple: true,
          maxFileSize: 5 * 1024 * 1024,
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          quality: "auto",
          fetch_format: "auto",
          styles: {
            palette: {
              window: "#ffffff",
              windowBorder: "#006eff",
              tabIcon: "#006eff",
              menuIcons: "#5a616a",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#a84bffff",
              action: "#fe4d9a",
              inactiveTabIcon: "#a84bffff",
              error: "#ff1100",
              inProgress: "#0077ff",
              complete: "#00ff1e",
              sourceBg: "#ffffff",
            },
          },
        },
        (error, result) => {
          if (error) {
            console.error(error);
            return;
          }

          if (result.event === "success") {
            uploadedRef.current.push({
              imageUrl: result.info.secure_url,
              cloudinaryId: result.info.public_id,
            });
          }

          if (result.event === "close") {
            setWidgetOpen(false);
            if (uploadedRef.current.length > 0) {
              // show confirmation modal
              setShowConfirm(true);
            }
          }
        }
      );
    } catch(err){
      console.error(err)
      onError?.(err?.message || "Could not open upload widget")
    }
  };

  const handleConfirm = async (save) => {
    const ensuredAlbumId = albumId || (await ensureAlbum?.());
    if (!ensuredAlbumId) {
      onError?.("Please enter an album name first.");
      return;
    }
    if (save) {
      // Save to backend
      try {
        await axios.post(
          "/api/photos",
          { albumId: ensuredAlbumId, photos: uploadedRef.current },
          { withCredentials: true }
        )
        // update the photo count
        onCountChange?.((prev) => prev + uploadedRef.current.length)
      } catch (err) {
        console.error("Error saving photos:", err);
      }
    } else {
      // Delete from Cloudinary
      try {
        await axios.post(
          "/api/photos/cancel",
          { cloudinaryIds: uploadedRef.current.map((img) => img.cloudinaryId) },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Error deleting photos:", err)
        onError?.(err?.response?.data?.message || "Upload confirm failed");
      } finally{
        // reset buffer and close modal
        uploadedRef.current = [];
        setShowConfirm(false);
      }
    }

    // reset buffer and close modal
    uploadedRef.current = [];
    setShowConfirm(false);
  };

  return (
    <>
      <button id="upload-widget-btn" onClick={openWidget}>Upload Image</button>

      {showConfirm && (
        <div className="confirm-modal">
          <p>Do you want to save the uploaded images?</p>
          <button onClick={() => handleConfirm(true)}>Yes</button>
          <button onClick={() => handleConfirm(false)}>No</button>
        </div>
      )}
    </>
  );
}

export default UploadButton;