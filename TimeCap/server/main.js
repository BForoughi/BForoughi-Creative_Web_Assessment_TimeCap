// -------Requiring node modules-------
import 'dotenv/config';
import express from 'express'
import * as path from 'path'
import sessions from 'express-session'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary';

// -------requiring the module exports-------
import * as users from './models/userModel.js'
import Photo from "./models/photosModel.js"
import Album from "./models/albumModel.js"

// .env variables
// -------MongoDB-------
const mongoPassword = process.env.MONGODB_PASSWORD
const mongoUsername = process.env.MONGODB_USERNAME
const mongoAppName = process.env.MONGODB_MYAPPNAME

// -------Cloudinary-------
const cloudName = process.env.CLOUND_NAME
const cloudKey = process.env.CLOUDINARY_API_KEY
const cloudSecret = process.env.CLOUDINARY_SECRET

const connectionString = `mongodb+srv://${mongoUsername}:${mongoPassword}@timecap.jjo4ept.mongodb.net/${mongoAppName}?retryWrites=true&w=majority`
mongoose.connect(connectionString)

// ----------server controller---------
const PORT = process.env.PORT || 4000
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser());

// ---------sessions----------
// Time variables
const threeMins = 3*60*1000;
const oneHour = 1*60*60*1000;
app.use(sessions({
    secret:process.env.mySessionSecret,
    store: MongoStore.create({
      mongoUrl: connectionString,
      ttl: 60 * 60
    }),
    cookie: {
        secure: false, 
        httpOnly: true, 
        sameSite: "lax", 
        maxAge: oneHour
    },
    resave: false,
    saveUninitialized: false
}))

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
});

// ----------CLOUDINARY API----------- https://cloudinary.com/
// code taken and adapted from cloudinary getting started page 
(async function() {
    // Configuration
    cloudinary.config({
        cloud_name: cloudName,
        api_key: cloudKey,
        api_secret: cloudSecret
    })
})();

// storing the user's id
const storeUserId = (req, res, next) => {
    if(req.session && req.session.userId){
        req.user = {_id: req.session.userId}
        return next()
    }
    return res.status(401).json({message: 'No user ID'})
}

// ----------ROUTES--------- 

app.get('/api/test', (req, res) => res.send('Connected!'))

// -------- REGISTER ------------
app.post('/api/register', async (req, res)=>{
    // sends the username and password from the form and passes it into the checkUser function
    const { username, password, firstname, surname } = req.body;
    const user = await users.addUser(username, password, firstname, surname)
    if(user){
        req.session.userId = user._id;
        req.session.username = username
        // successful register
        return res.status(200).json({
            success: true, user: {username: user.username, firstname: user.firstname, surname: user.surname}
        })
    } else{
        //else false log invalid login and send to login failed
        return res.status(401).json({
            success: false, message: "Username is already taken"
        })
    }
})

// -------- LOGIN ------------
app.post('/api/login', async (req, res)=>{
    // sends the username and password from the form and passes it into the checkUser function
    const { username, password } = req.body 
    const user = await users.checkUser(username, password)
    if(user){
        req.session.userId = user._id;
        req.session.username = user.username
        // successful login
        return res.status(200).json({
            success: true, user: {username: user.username, firstname: user.firstname}
        })
    } else{
        //else false log invalid login and send to login failed
        return res.status(401).json({
            success: false, message: "Invalid username or password"
        })
    }
})

// session checker router
app.get('/api/auth/check', (req, res) => {
    if(req.session.username){
        return res.status(200).json({
            loggedIn: true, user: req.session.username
        })
    } else{
        return res.status(401).json({ loggedIn: false })
    }
})

// Logout
app.post("/api/logout", (req, res) =>{
    try{
        if(!req.session){
            return res.status(400).json({ success: false, message: "session not found" })
        }
        
        req.session.destroy()
        res.clearCookie("connect.sid") // clearing the session cookie
        return res.status(200).json({ success: true })
    } catch(err){
        console.error("Problem with logout route", err)
        res.status(500).json({ success: false, message: "Server error" })
    }
})

// The below two routes was created by chatgpt and I, I used it to change my original code (adapted from cloudinary getting started code). I added the prompts to stop uploads
// to cloudinary and mongo if the user clicks "X" on the upload widget and to upload to cloudinary and mongo DB if the user clicks "done" on the widget. Note the original code
// was similar to what I have previously done with creating a new user. Note that also my album code has been added to it.

// storing user's uploaded photos urls from cloudinary upload widget in and album and then into mongo db 
// SAVE CONFIRMED UPLOADS
app.post("/api/photos", storeUserId, async (req, res) => {
    const { photos, albumId } = req.body;

    if (!Array.isArray(photos) || photos.length === 0) {
        return res.status(400).json({ message: "No photos provided" });
    }

    try {
        // confirming the album belongs to the user
        if(albumId){
            const album = await Album.findOne({_id: albumId, userId: req.user._id})
            if(!album){
                return res.status(404).json({ message: "Album not found" })
            }
            const isLocked = album.lockedUntil && album.lockedUntil.getTime() > Date.now()
            if(isLocked){
                return res.status(403).json({ message: "Album is locked. Cannot add photos." })
            }
        }


        const savedPhotos = await Photo.insertMany(
            photos.map(photo => ({
                userId: req.user._id,
                albumId: albumId || null,
                imageUrl: photo.imageUrl,
                cloudinaryId: photo.cloudinaryId
            }))
        );

        res.status(201).json({
            success: true,
            photos: savedPhotos
        });
    } catch (err) {
        console.error("Error saving photos:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE UNCONFIRMED UPLOADS
app.post("/api/photos/cancel", storeUserId, async (req, res) => {
    const { cloudinaryIds } = req.body;

    if (!Array.isArray(cloudinaryIds) || cloudinaryIds.length === 0) {
        return res.json({ success: true });
    }

    try {
        await Promise.all(
            cloudinaryIds.map(publicId =>
                cloudinary.uploader.destroy(publicId)
            )
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Cloudinary cleanup failed:", err);
        res.status(500).json({ message: "Cleanup failed" });
    }
});
// ---------------END-----------------

//creating album route
app.post("/api/albums", storeUserId, async (req, res) => {
    const {title, message} = req.body

    if(!title || !title.trim()){
        return res.status(400).json({success: false, message: "Album name is required"})
    }

    try{
        const album = await Album.create({
            userId: req.user._id,
            title: title.trim(),
            message: (message || "").trim(),
            lockedUntil: null
        })
        res.status(201).json({success: true, album})
    } catch(err){
        console.err("Error creating album")
        return res.status(500).json({ success: false, message: "Server error" });
    }
    
})

// fetching the album with the unlock date closest to current date (whatever unlocks sooner)
app.get("api/albums", storeUserId, async (req, res) =>{
    try{
        const albums = await Album.find({userId: req.user._id}).sort({lockedUntil: 1, createdAt: 1})

        // sending clean data - not raw mongo data
        const shaped = albums.map((a) =>{
            // sorting via lockedUntil time (soonest first)
            const isLocked = a.lockedUntil && a.lockedUntil.getTime() > Date.now()
            return{
                _id: a._id,
                title: a.title,
                message: a.message,
                lockedUntil: a.lockedUntil,
                isLocked,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
            }
        })
        res.json({success: true, albums: shaped})
    } catch(err){
        console.error("error fetching albums")
        res.status(500).json({success: false, message: "Server Error"})
    }
})

// This was made by chatgpt using my current code. I prompt what is the best way to lock my album and then have it stored into mongo to then be later unlocked, 
// I then asked it to explain the code to me
// patch is used to update a single field
app.patch("/api/albums/:id/lock", storeUserId, async (req, res) => {
    const { unlockAt, lockForSeconds } = req.body;

    try {
        const album = await Album.findOne({ _id: req.params.id, userId: req.user._id });
        if (!album) return res.status(404).json({ success: false, message: "Album not found" });

        let lockedUntil;

        if (unlockAt) {
            // custom date from user
            lockedUntil = new Date(unlockAt);
        } else if (lockForSeconds) {
            // user selects one of the time presets e.g. 1 month 3 months...
            lockedUntil = new Date(Date.now() + Number(lockForSeconds) * 1000);
        } else {
            return res.status(400).json({
                success: false,
                message: "Provide unlockAt or lockForSeconds",
            });
        }

        // validate the date to see whether it's a real date and whether it is in the future
        if (Number.isNaN(lockedUntil.getTime()) || lockedUntil <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Unlock time must be a valid future date",
            });
        }

        album.lockedUntil = lockedUntil;
        await album.save();

        return res.json({ success: true, lockedUntil: album.lockedUntil });
    } catch (err) {
        console.error("Error locking album:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});