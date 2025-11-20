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

const MongoStore = require("connect-mongo")

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
//app.use(express.static('views'))
//app.use(express.static('admin'))
app.use('/scripts', express.static('scripts'))
app.use('/admin', express.static('admin'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

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

app.get('/debug', (req, res) => {
    res.json(req.session);
});

// route that allows a logged in user to access their profile page
app.get('/profile_page', checkLoggedIn, (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'profile_page.html'))  
})

app.get('/admin_page', adminOnly,(request, response)=>{
    response.sendFile(path.join(__dirname, '/admin', 'admin_page.html'))  
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

// admin checker 
async function adminOnly(req, res, nextAction){
    //console.log("Full session object:", req.session)
    // checks for a session
    if(req.session.username){
        const user = await users.userData.findOne({username: req.session.username});
        req.user = user;
        if(req.user && req.user.admin){
            nextAction()
        } else{
            // needs to return json so none admin users can continue using the app
            return res.json({ admin: false })
        }
    } else{
        // if there is no session redirect to not logged in 
        res.sendFile(path.join(__dirname, '/views', 'notloggedin.html'))
    }
}

// checking admin but as a get request to send data
app.get('/isAdmin', async (req, res)=>{
    //console.log(req.session.username)
    if(req.session.username){
        const user = await users.userData.findOne({username: req.session.username})
        if(!user){
            return res.json({admin: false})
            //return console.log(user)
        }
        //console.log(user)
        res.json({admin: user.admin === true})
    } else{
        return res.json({admin: false})
    }
})

// getting all posts
// app.get('/getallposts', adminOnly, async (request, response) =>{
//     response.json({posts: await posts.getAllPosts()})
// })

// getting users
app.get("/users", adminOnly, async (req, res)=>{
    const getUsers = await users.userData.find({}, "-password")
    res.json(getUsers)
})

app.get("/users/:id/posts", adminOnly, async(req, res)=>{
    const usersPosts = await posts.postData.find({author: req.params.id})
    res.json(usersPosts)
})

// deleting users and their posts
app.delete("/users/:id", adminOnly, async (req, res)=>{
    await users.userData.findByIdAndDelete(req.params.id)
    await posts.postData.deleteMany({user: req.params.username})
    res.json({message: "User and their posts have been deleted"})
})

// deleting posts
app.delete("/posts/:id", adminOnly, async (req, res) =>{
    await posts.postData.findByIdAndDelete(req.params.id)
    res.json({message: "Post deleted"})
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
    const username = req.body.username
    const password = req.body.password
    if(await users.checkUser(username, password)){

        // if it comes back true set the session username to the username from the form
        //req.session.username=req.body.username
        req.session.username = username
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
    if(await users.addUser(req.body.username, req.body.password, req.body.firstname, req.body.surname)){
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
        } else{
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
        }
    } catch(err){
        console.log(err)
    }
})

// getting the session username
app.get("/session-user", (request, response) => {
    if (request.session.username) {
        return response.json({
            loggedIn: true,
            username: request.session.username
        })
    }
    return response.json({ loggedIn: false });
    
});

// a get controller that retrieves the users first and last name from the database
app.get('/user/:username', async (req, res) => {
    try{
        const username = req.params.username
        // getting the data from the database
        const user = await users.userData.findOne(
            {username: username},
            {firstname: 1, surname: 1, _id: 0}
        )
        // if user founnd set the names and send it to the front end
        if(user){
            return res.json({
                found: true,
                firstname: user.firstname,
                surname: user.surname
            })
        }
        // else return user not found
        return res.json({found: false})
    } catch(err){
        console.log(err)
        res.json({found:false})
    }
})

app.post('/user/update-name', checkLoggedIn, async (req,res) =>{
    // const { firstname, surname} = req.body
    const firstname = req.body.firstname
    const surname = req.body.surname
    const username = req.session.username
    
    try{
        // console.log("BODY:", req.body);
        // console.log("SESSION:", req.session);
        // console.log("USERNAME:", req.session.username);
        const updateUser = await users.userData.findOneAndUpdate(
            {username}, // shorthand js - the variable name is the same as the input field
            {firstname, surname}, // longhand: {firstname: firstname, surname: surname}
            {new: true}
        )

        if(updateUser){
            return res.json({
                success: true,
                firstname: updateUser.firstname,
                surname: updateUser.surname
            })
        }
        return res.send("update failed")
    } catch(err){
        console.log(err)
        res.send("update failed")
    }
})




// app.post('/test/:id', (req, res) => {
//     console.log('Test route hit', req.params.id);
//     res.json({ success: true });
// });

// app.get("/debug", (req, res) => {
//     console.log("Cookies sent by browser:", req.headers.cookie);
//     res.json({ cookies: req.headers.cookie });
// });



// note to self "post" sends data from the front end to back end, "get" sends data from the back end to the front end