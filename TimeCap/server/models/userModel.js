import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const {Schema, model} = mongoose
const saltRounds = 10

// MongoDB Schema
const userSchema = new Schema({
    username: String,
    password: String,   
    firstname: String,
    surname: String,
    admin: { type: Boolean, default: false }
})
const userData=model('users', userSchema)

// Registering a user
async function addUser(registerUsername, password, firstname, surname){
    // check whether the username already exists
    let existingUser = null
    existingUser = await userData.findOne({username:registerUsername})
    // if there is no existing username than add user 
    if(!existingUser){
        // hashing the password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        let newUser = {
            username:registerUsername,
            password:hashedPassword,
            firstname:firstname,
            surname:surname
        }
        await userData.create(newUser)
        // users.push(newUser)
        //console.log(users)
        return true
    }
    return false
}

// checking if a user exists so they can be logged in
async function checkUser(loginUsername, password){
    let foundUser = null
    foundUser = await userData.findOne({username:loginUsername})
    // if the user is found look for a matching password
    if(foundUser){
        const passwordMatch = await bcrypt.compare(password, foundUser.password)
        if(passwordMatch){
            return foundUser // returns true or false
        }
    }
    // if not return false
    return false
}

export {
    addUser,
    checkUser,
    userData
}