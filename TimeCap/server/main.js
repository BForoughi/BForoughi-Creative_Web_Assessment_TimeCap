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
// was similar to what I have previously done with creating a new user.

// storing user's uploaded photos urls from cloudinary upload widget into mongo db 
// SAVE CONFIRMED UPLOADS
app.post("/api/photos", storeUserId, async (req, res) => {
    const { photos } = req.body;

    if (!Array.isArray(photos) || photos.length === 0) {
        return res.status(400).json({ message: "No photos provided" });
    }

    try {
        const savedPhotos = await Photo.insertMany(
            photos.map(photo => ({
                userId: req.user._id,
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
// --------------------------------

// creating album route
// app.post("api/albums", storeUserId, aysnc (req, res) => {
//     const 
// })