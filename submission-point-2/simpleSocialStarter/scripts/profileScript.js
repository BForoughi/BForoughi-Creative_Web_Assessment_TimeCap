const editNameForm = document.getElementById("editNameForm")
const updateStatus = document.getElementById("updateStatus")

editNameForm.addEventListener("submit", async(e)=>{
    e.preventDefault()

    const firstname = document.getElementById("edit-fn").value
    const surname = document.getElementById("edit-ln").value

    try{
        const res = await fetch("/user/update-name", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({firstname, surname}),
            credentials: "include"
        })

        const data = await res.json()

        if(data.success){
            updateStatus.innerText = "Name updated successfully!"
            document.getElementById("users-name").innerText = `${data.firstname} ${data.surname}`
        } else{
            updateStatus.innerText = `Update failed: ${data.message}`
        }
    } catch (err) {
        console.log(err);
        updateStatus.innerText = "An error occurred while updating the name.";
    }
})