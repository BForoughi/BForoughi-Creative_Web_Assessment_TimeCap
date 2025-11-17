const recentPosts=document.getElementById('recent-posts')
        
//const postId = null // - post id from mongo

fetch('/getposts')
    .then(response=>response.json())
    .then(processData)

function processData(data){
    //console.log(data)
    if(recentPosts){
        recentPosts.innerText="" 
        data.posts.forEach(post=>{
            let li=document.createElement('li')
            let btn = document.createElement('button')
            let likes = document.createElement('p')

            // fetch(`/test/${post._id}`, { method: 'POST' });

            li.innerText=`${post.user}: ${post.message} `
            btn.innerText = "❤️"
            likes.innerText = `Likes: ${post.likes}`
            
            li.classList.add('li')
            btn.classList.add('like-btn')
            likes.id = `likes-${post._id}`
            // console.log(post._id)
            recentPosts.appendChild(li)
            li.appendChild(btn)
            li.appendChild(likes)

            btn.addEventListener('click', async()=>{
                try{
                    //console.log('Click', post._id)
                    //const res = await fetch(`/posts/${postId}/like`)
                    likePost(post._id)
                } catch(err) {
                    console.log(err)
                }
            })
        })  
    }
    
    
}

async function likePost(id){
    const res = await fetch(`/getposts/${id}/like`, {method: 'POST'})
    const data = await res.json()
    if(!data.allowed){
        //console.log(data.error)
        let cannotLike = document.createElement('p')
        cannotLike.innerText = "You can't like your own post"
        document.getElementById(`likes-${id}`).appendChild(cannotLike)
        return;   
    }
    
    document.getElementById(`likes-${id}`).innerText = `Likes: ${data.likes}`
}

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
            console.log(userData.firstname, userData.surname)
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

    console.log(`${fullName.firstname} ${fullName.surname}`)
    document.getElementById("users-name").innerText = `${fullName.firstname} ${fullName.surname}`
}
loadUsername()