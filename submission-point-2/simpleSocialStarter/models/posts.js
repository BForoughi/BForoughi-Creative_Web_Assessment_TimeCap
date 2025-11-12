let nextPostID = 2

//  user posts object
let userPosts=[
    {
        postID: 1,
        message:"hello",
        user:"user1"
    },
    {
        postID: 0,
        message:"hello",
        user:"user1"
    }
]

// function that adds a new post
function newPost(message, username){
    let thisPost={
        postID: nextPostID++,
        message: message,
        user: username
    }
    userPosts.push(thisPost)
}

// function to return the object so it can be passed to the index.js - addapted to show the 8 most recent posts
function getPosts(n=2){
    return userPosts.slice(-n).reverse()
}

// module exports that send the add new post and get posts to the index.js
module.exports={
    newPost,
    getPosts
}