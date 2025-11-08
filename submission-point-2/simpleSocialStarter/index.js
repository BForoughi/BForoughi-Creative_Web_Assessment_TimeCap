const dotenv = require("dotenv");
dotenv.config();
const express= require('express')
const app=express()
const path=require('path')
const PORT = process.env.PORT || 3000

// requiring the module exports
const posts = require('./models/posts');
const users = require('./models/users')
// server controller
app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})

app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))

app.get('/app', (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'app.html'))
})

// controller that passes the inputted message from the front into the newPost function in the backend (posts.js)
app.post('/newpost', (request, response)=>{
    //console.log(request.body)
    posts.newPost(request.body.message, "userX")
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

app.get('/register', (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'register.html'))
})

app.get('/logout', (request, response)=>{
    response.sendFile(path.join(__dirname, '/views', 'logout.html'))
})

app.post('/register', (req, res)=>{
    if(users.addUser(req.body.username, req.body.password)){
      res.sendFile(path.join(__dirname, '/views', 'login.html'))  
    }
    res.sendFile(path.join(__dirname, '/views', 'registration_failed.html'))
})

app.post('/login', (req, res)=>{
    if(users.checkUser(req.body.username, req.body.password)){
        res.sendFile(path.join(__dirname, '/views', 'app.html'))
    } else{
        console.log("invalid login")
        res.sendFile(path.join(__dirname, '/views', 'login_failed.html'))
    }
    
})

// note to self "post" sends data from the front end to back end, "get" sends data from the back end to the front end