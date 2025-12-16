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

// ----------ROUTES--------- 

app.get('/api/test', (req, res) => res.send('Connected!'))

// -------- REGISTER ------------
app.post('/api/register', async (req, res)=>{
    // sends the username and password from the form and passes it into the checkUser function
    const { username, password, firstname, surname } = req.body;
    const user = await users.addUser(username, password, firstname, surname)
    if(user){
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