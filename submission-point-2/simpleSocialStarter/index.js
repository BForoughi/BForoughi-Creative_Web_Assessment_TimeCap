// -------Requiring node modules-------
const dotenv = require("dotenv");
dotenv.config();
const express= require('express');
const app=express();
const path=require('path');
const PORT = process.env.PORT || 4000
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose=require('mongoose');

// -------MongoDB-------
const mongoPassword = process.env.MONGODB_PASSWORD
const mongoUsername = process.env.MONGODB_USERNAME
const mongoAppName = process.env.MONGODB_MYAPPNAME

const connectionString = `mongodb+srv://${mongoUsername}:${mongoPassword}@timecap.jjo4ept.mongodb.net/${mongoAppName}?retryWrites=true&w=majority`
mongoose.connect(connectionString)

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
app.use(express.static('views'));
app.use(express.urlencoded({extended: true}))

app.use(sessions({
    secret:process.env.mySessionSecret,
    cookie: {maxAge: threeMins},
    resave: false,
    saveUninitialized: false
}))

// session checker function
function checkLoggedIn(request, response, nextAction){
    // checks for a session
    if(request.session){
        // checks for a valid session with a valid username
        if(request.session.username){
            nextAction()
        } else{
            // if not a valid username destroy session and redirect to not logged in
            request.session.destroy()
            response.sendFile(path.join(__dirname, '/views', 'notloggedin.html'))
        }
    } else{
        // if there is no session redirect to not logged in 
        response.sendFile(path.join(__dirname, '/views', 'notloggedin.html'))
    }
}


// -------APP CONTROLLERS-------
app.get('/app', checkLoggedIn, (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'app.html'))  
})

// controller that passes the inputted message from the front into the addPost function in the backend (posts.js)
app.post('/newpost', (request, response)=>{
    //console.log(request.body)
    posts.addPost(request.body.message, request.session.username)
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

// controller that sends the posts to the front end
app.get('/getposts', async (request, response) =>{
    response.json({posts: await posts.getPosts(8)})
})

app.get('/newpost', (request, response) =>{
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

app.get('/login', (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'login.html'))
})

// login controller
app.post('/login', async (req, res)=>{
    // sends the username and password from the form and passes it into the checkUser function
    if(await users.checkUser(req.body.username, req.body.password)){
        // if it comes back true set the session username to the username from the form
        req.session.username=req.body.username
        // then send them to the app file
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
app.post('/register', async (req, res)=>{
    if(await users.addUser(req.body.username, req.body.password)){
      res.sendFile(path.join(__dirname, '/views', 'login.html'))  
    } else{
        //else false send to registration failed
        res.sendFile(path.join(__dirname, '/views', 'registration_failed.html'))
    }
})

app.get('/logout', checkLoggedIn, (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'logout.html'))
})

app.post('/logout', (req, res)=>{
    req.session.destroy()
    res.redirect('/')
})

app.post('/getposts/:id/like', async(req, res) => {
    try{
        const postId = req.params.id
        const post = await posts.postData.findById(postId)

        // 404 error message incase there is no post
        if(!post){
            return res.status(404).json({ error: "Post not found" })
        }

        if(post.user === req.session.username){
            return res.json({ 
                allowed: false,
                //blocked: true, 
                likes: post.likes})
        }

        // Increments the likes by 1
        const updateLikes = await posts.postData.findByIdAndUpdate(
            postId,
            {$inc: {likes:1}},
            {new:true}
        )

        res.json({
            allowed:true,
            likes: updateLikes.likes
        })
    } catch(err){
        console.log(err)
    }
})

// app.post('/test/:id', (req, res) => {
//     console.log('Test route hit', req.params.id);
//     res.json({ success: true });
// });


// note to self "post" sends data from the front end to back end, "get" sends data from the back end to the front end