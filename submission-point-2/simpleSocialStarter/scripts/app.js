const recentPosts=document.getElementById('recent-posts')
        
//const postId = null // - post id from mongo

fetch('/getposts')
    .then(response=>response.json())
    .then(processData)

    // This function displays all the posts currently stored and adds a like button and like counter to each post
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

// This function fetches a back end route that stores a new like and this function outputs the like and also outputs the author is not allowed to like the post
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
