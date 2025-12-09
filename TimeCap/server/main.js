// -------Requiring node modules-------
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const path = require('path');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose=require('mongoose');
const MongoStore = require("connect-mongo");

// -------MongoDB-------
// const mongoPassword = process.env.MONGODB_PASSWORD
// const mongoUsername = process.env.MONGODB_USERNAME
// const mongoAppName = process.env.MONGODB_MYAPPNAME

// const connectionString = `mongodb+srv://${mongoUsername}:${mongoPassword}@timecap.jjo4ept.mongodb.net/${mongoAppName}?retryWrites=true&w=majority`
// mongoose.connect(connectionString)

// ----------server controller---------
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})

app.use(express.json())

app.get('/api/test', (req, res) => res.send('Connected!'))