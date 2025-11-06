import dotenv from "dotenv";
dotenv.config();
const express= require('express')
const app=express()
const path=require('path')
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})

app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))

app.get('/app', (request, response)=>{
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
