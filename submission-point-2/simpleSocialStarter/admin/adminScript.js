async function checkAdmin() {
    try{
        const res = await fetch('/isAdmin', {
            method: 'GET',
            credentials: 'include'
        })

        const data = await res.json()
        
        if(data){
            //console.log("resonse: ", data)
            if(data.admin){
                // if the user is an admin created an admin page tag for the navbar
                const nav = document.getElementById("navbar")
                const aTag = document.createElement("a")
                if(nav){
                    aTag.href = "admin_page"
                    aTag.innerText = "Admin Page"
                    nav.appendChild(aTag)
                }else{
                    return;
                }
                
            } else{
                // otherwise return nothing so the none admin user doesn't get the page added to the nav - needed to not break the app
                return;
            }
        }
    } catch(err){
        console.log("issue with: ", err)
    }
}

async function displayingUsers(){
    try{
        // fetch the users and include the session credentials
        const res = await fetch('/users', {
            method: 'GET',
            credentials: 'include'
        })

        const data = await res.json()
        if(!data){
            console.log("not recieveing data")
        }
        const userUl = document.getElementById('social-users')
        if (!userUl) return; // - needed to not break the system also !user instead of (user) so the big block of code isnt even more indented which makes it easier to read
        data.forEach(user => {
            // Creating elements
            let li = document.createElement('li')
            let postBtn = document.createElement('button')
            let deleteBtn = document.createElement('button')

            // assigning id's and class names
            li.id = `user-${user._id}`
            li.classList.add('users-li')
            postBtn.classList.add('admin-btns')
            deleteBtn.classList.add('admin-btns')

            postBtn.innerText = ("Users posts")
            deleteBtn.innerText = ("Delete user")
            li.innerText = `${user.username}`

            userUl.appendChild(li)
            li.appendChild(postBtn)
            li.appendChild(deleteBtn)

            // making my buttons functionable
            postBtn.addEventListener("click", ()=>{
                displayingUserPosts(user.username, user._id)
            })

            deleteBtn.addEventListener("click", ()=>{
                deleteUser(user._id)
            })
        });

    } catch(err){
        console.log("issue with: ", err)
    }
}

// This function fetches a back end route that deletes both a user and all their posts
async function deleteUser(userId){
    try{
        const res = await fetch(`/users/${userId}`, {method: 'DELETE', credentials: 'include'})
        const data = await res.json()
        if(data.message){
            alert(data.message)
            let userDeleted = document.createElement('p')
            userDeleted.innerText = "User deleted!"
        }

        const li = document.getElementById(`user-${userId}`)
        if(li) li.remove();
    } catch(err){
        console.log("issue with: ", err)
    }
    
}

// This displays all the users posts under their username - would make it a grid when it comes to scaling the app
async function displayingUserPosts(username, userId){
    try{
        const res = await fetch(`/users/${username}/posts`, {method: 'GET', credentials: 'include'})
        const posts = await res.json()
        const postId = posts._id
        //console.log("Fetched posts:", posts);
        if(!posts){
            console.log("no data recieved")
        }
        //console.log(posts)
        const container = document.getElementById(`user-${userId}`)
        const postsUl = document.createElement('ul')
        postsUl.id = "posts-list"
        container.appendChild(postsUl)

        posts.forEach(post =>{
            const postLi = document.createElement('li')
            const deletePost = document.createElement('button')
            postLi.id = `post-${post._id}`
            deletePost.classList.add('delete-post')

            deletePost.innerText = "Delete Post"
            postLi.innerText = post.message

            postsUl.appendChild(postLi) 
            postLi.appendChild(deletePost)

            deletePost.addEventListener("click", ()=>{
                deleteUserPost(post._id)
            })
        })
    }catch(err){
        console.log("issue with: ", err)
    }
}

// This fetches a back end route that deletes a selected post
async function deleteUserPost(postId){
    try{
        const res = await fetch(`/posts/${postId}`, {method: 'DELETE', credentials: 'include'})
        const data = await res.json()
        if(data.message){
            alert(data.message)
            let postDeleted = document.createElement('p')
            postDeleted.innerText = "User deleted!"
        }

        const li = document.getElementById(`post-${postId}`)
        if(li) li.remove();
    } catch(err){
        console.log("issue with: ", err)
    }
}

// calling functions that are not involved in a button click so they can still run
checkAdmin()
displayingUsers()


// ---------------KEPT FOR REFERENCE-------------
// fetch('/isAdmin')
//     .then(res => res.json())
//     .then(data =>{
//         console.log("resonse: ", data)
//         console.log(data.username)
//         if(data.admin){
//             const nav = document.getElementById("navbar")
//             const aTag = document.createElement("a")
//             aTag.href = "admin_page"
//             aTag.innerText = "Admin Page"
//             nav.appendChild(aTag)
//         }
//     })