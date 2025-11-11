// -------requiring node modules-------
const dotenv = require("dotenv");
dotenv.config();
const express= require('express');
const app=express();
const path=require('path');
const PORT = process.env.PORT || 3000
const sessions = require('express-session');
const cookieParser = require('cookie-parser')

// -------requiring the module exports-------
const posts = require('./models/posts');
const users = require('./models/users');

// Time variables
const threeMins = 3*60*1000;
const oneHour = 1*60*60*1000;

// server controller
app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})

// -------initialising node modules-------
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.use(sessions({
    secret:process.env.mySessionSecret,
    cookie: {maxAge: threeMins},
    resave: false,
    saveUninitialized: false
}))

// -------APP CONTROLLERS-------
app.get('/app', (request, response)=>{
    // checks for a session
    if(request.session){
        // checks for a valid session with a valid username
        if(request.session.username){
            response.sendFile(path.join(__dirname, '/views', 'app.html'))
        } else{
            // if not a valid username destroy session and redirect to not logged in
            request.session.destroy()
            response.sendFile(path.join(__dirname, '/views', 'notloggedin.html'))
        }
    } else{
        // if there is no session redirect to not logged in 
        response.sendFile(path.join(__dirname, '/views', 'notloggedin.html'))
    }
    
})

// controller that passes the inputted message from the front into the newPost function in the backend (posts.js)
app.post('/newpost', (request, response)=>{
    //console.log(request.body)
    posts.newPost(request.body.message, request.body.username)
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

// controller that sends the posts to the front end
app.get('/getposts', (request, response) =>{
    response.json({posts:posts.getPosts()})
})

app.get('/newpost', (request, response) =>{
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

app.get('/login', (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'login.html'))
})

// login controller
app.post('/login', (req, res)=>{
    if(users.checkUser(req.body.username, req.body.password)){
        req.session.username=req.body.username
        res.sendFile(path.join(__dirname, '/views', 'app.html'))
    } else{
        //else false log invalid login and send to login failed
        console.log("invalid login")
        res.sendFile(path.join(__dirname, '/views', 'login_failed.html'))
    }
})

app.get('/register', (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'register.html'))
})

// adding users controller
app.post('/register', (req, res)=>{
    if(users.addUser(req.body.username, req.body.password)){
      res.sendFile(path.join(__dirname, '/views', 'login.html'))  
    } else{
        //else false send to registration failed
        res.sendFile(path.join(__dirname, '/views', 'registration_failed.html'))
    }
})

app.get('/logout', (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'logout.html'))
})





// note to self "post" sends data from the front end to back end, "get" sends data from the back end to the front end