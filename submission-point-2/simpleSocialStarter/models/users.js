// let users=[
//     {
//         username: "user1",
//         password: "123"
//     },{
//         username: "user2",
//         password: "456"
//     }
// ]

const mongoose = require('mongoose');
const {Schema, model} = mongoose;

// Schema
const userSchema = new Schema({
    username: String,
    password: String
})

const userData=model('users', userSchema)

// username and password are submitted via the form
async function addUser(registerUsername, password){
    // check whether the username exists using the findUser function
    // let existingUser=findUser(username)
    let existingUser = null
    existingUser = await userData.findOne({username:registerUsername})
    // if there is no existing username than add user 
    if(!existingUser){
        let newUser = {
            username:registerUsername,
            password:password
        }
        await userData.create(newUser)
        // users.push(newUser)
        //console.log(users)
        return true
    }
    return false
}

async function checkUser(loginUsername, password){
    //let foundUser = findUser(username)
    // if the user is found look for a matching password
    let foundUser = null
    foundUser = await userData.findOne({username:loginUsername})
    if(foundUser){
        return foundUser.password==password
    }
    // if not return false
    return false
}

// function that searches the (users) database and searches for a matching username inputted from the front end
function findUser(username){
    return users.find(thisUser=>thisUser.username==username)
}

module.exports={
    addUser,
    checkUser,
    findUser
}