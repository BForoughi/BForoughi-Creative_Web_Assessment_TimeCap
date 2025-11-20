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
                return;
            }
        }
    } catch(err){
        console.log("issue with: ", err)
    }
}

async function displayingUsers(){
    try{
        const res = await fetch('/users', {
            method: 'GET',
            credentials: 'include'
        })

        const data = await res.json()
        if(!data){
            console.log("not recieveing data")
        }
        const userUl = document.getElementById('social-users')
        if (!userUl) return;
        data.forEach(user => {
            
            let li = document.createElement('li')
            let postBtn = document.createElement('button')
            let deleteBtn = document.createElement('button')

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

            deleteBtn.addEventListener("click", ()=>{
                deleteUser(user._id)
            })
        });

    } catch(err){
        console.log("issue with: ", err)
    }
}

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

checkAdmin()
displayingUsers()

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