// -------Requiring node modules-------
import 'dotenv/config';
import express from 'express'
import * as path from 'path'
import sessions from 'express-session'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cors from 'cors'

// -------requiring the module exports-------
//const users = require('./models/users');
import * as users from './models/userModel.js'

// -------MongoDB-------
const mongoPassword = process.env.MONGODB_PASSWORD
const mongoUsername = process.env.MONGODB_USERNAME
const mongoAppName = process.env.MONGODB_MYAPPNAME

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

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})

app.get('/api/test', (req, res) => res.send('Connected!'))

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
        secure: false, // allows for cookies to be sent over http
        httpOnly: true, // this means js cannot access the cookie, when using sessions you always want this as it denies anyone trying to steal the cookie
        // sameSite allows the cookie to be sent over sites
        sameSite: "lax", // lax allows it to be via GET requests
        maxAge: oneHour
    },
    resave: false,
    saveUninitialized: false
}))

// -------- REGISTER ------------
app.post('/api/register', async (req, res)=>{
    // sends the username and password from the form and passes it into the checkUser function
    const username = req.body.username
    const password = req.body.password
    const firstname = req.body.firstname
    const surname = req.body.surname
    const user = await users.addUser(req.body.username, req.body.password, req.body.firstname, req.body.surname)
    if(user){
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
    const username = req.body.username
    const password = req.body.password
    const user = await users.checkUser(username, password)
    if(user){
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

