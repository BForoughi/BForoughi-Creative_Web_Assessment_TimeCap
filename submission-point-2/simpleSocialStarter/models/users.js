let users=[
    {
        username: "user1",
        password: "123"
    },{
        username: "user2",
        password: "456"
    }
]

// username and password are submitted via the form
function addUser(username, password){
    // check whether the username exists using the findUser function
    let existingUser=findUser(username)
    // if there is no existing username than add user 
    if(!existingUser){
        let newUser = {
            username:username,
            password:password
        }
        users.push(newUser)
        //console.log(users)
        return true
    }
    return false
}

function checkUser(username, password){
    let foundUser = findUser(username)
    // if the user is found look for a matching password
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