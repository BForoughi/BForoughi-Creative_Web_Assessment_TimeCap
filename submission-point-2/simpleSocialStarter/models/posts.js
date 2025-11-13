// let nextPostID = 2;

const mongoose = require('mongoose');
const {Schema, model} = mongoose;

// Schema
const postSchema = new Schema({
    user: String,
    message: String,
    likes: Number,
    time: Date
})

const postData=model('posts', postSchema)

//  user posts object
// let userPosts=[
//     {
//         postID: 1,
//         message:"hello",
//         user:"user1"
//     },
//     {
//         postID: 0,
//         message:"hello",
//         user:"user1"
//     }
// ]

// function that adds a new post
function addPost(message, username){
    let newPost={
        // postID: nextPostID++,
        user: username,
        message: message,
        likes: 0,
        time: Date.now()
    }
    // userPosts.push(thisPost)
    postData.create(newPost)
}

// function to return the object so it can be passed to the index.js - addapted to show the most recent posts
function getPosts(n=2){
    return userPosts.slice(-n).reverse()
}

// module exports that send the add new post and get posts to the index.js
module.exports={
    addPost,
    getPosts
}