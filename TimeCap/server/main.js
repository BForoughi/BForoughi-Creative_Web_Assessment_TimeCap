// -------Requiring node modules-------
import 'dotenv/config';
import express from 'express'
const app = express();
import * as path from 'path'
import sessions from 'express-session'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

// -------MongoDB-------
const mongoPassword = process.env.MONGODB_PASSWORD
const mongoUsername = process.env.MONGODB_USERNAME
const mongoAppName = process.env.MONGODB_MYAPPNAME

const connectionString = `mongodb+srv://${mongoUsername}:${mongoPassword}@timecap.jjo4ept.mongodb.net/${mongoAppName}?retryWrites=true&w=majority`
mongoose.connect(connectionString)

// ----------server controller---------
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})

app.use(express.json())

//app.get('/api/test', (req, res) => res.send('Connected!'))

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