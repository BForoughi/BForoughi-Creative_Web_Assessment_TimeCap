// function that recieves the logged in user
async function getCurrentUser() {
    // fetching backend data and sending cookies so the user's session is recoginsed 
    const response = await fetch("/session-user", {method: "GET", credentials: "include"})
    const data = await response.json()

    if(!data.loggedIn){
        console.log("User not logged in")
        return null
    } else{
        return data.username
    }
}

// fetching the users first and last name from the backend get route
async function getUsersName(username) {
    try{
        const response = await fetch(`/user/${username}`, {method: "GET", credentials: "include"})
        const userData = await response.json()

        if(userData.found){
            //console.log(userData.firstname, userData.surname)
            return userData;
        } else{
            console.log("user not found")
            return null
        }
    } catch(err){
        console.log("fetch error: ", err)
    }  
}
//getUsersName(userData.username);

async function loadUsername() {
    const username = await getCurrentUser()
    if(!username) {
        return console.log("no username")
    }
    const fullName = await getUsersName(username)
    if(!fullName){
        return console.log("no name")
    }

    //console.log(`${fullName.firstname} ${fullName.surname}`)
    document.getElementById("users-name").innerText = `${fullName.firstname} ${fullName.surname}`
}
loadUsername()