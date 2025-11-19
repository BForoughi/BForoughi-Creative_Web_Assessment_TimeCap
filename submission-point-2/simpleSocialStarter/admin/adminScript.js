async function checkAdmin() {
    try{
        const res = await fetch('/isAdmin', {
        method: 'GET',
        credentials: 'include'
        })

        const data = await res.json()
        if(data){
            console.log("resonse: ", data)
            if(data.admin){
                const nav = document.getElementById("navbar")
                const aTag = document.createElement("a")
                aTag.href = "admin_page"
                aTag.innerText = "Admin Page"
                nav.appendChild(aTag)
            }
        }
    } catch(err){
        console.log("issue with: ", err)
    }
}

checkAdmin()

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