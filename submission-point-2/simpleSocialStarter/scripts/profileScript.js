const editNameForm = document.getElementById("editNameForm")


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
            document.getElementById("users-name").innerText = `${data.firstname} ${data.surname}`
            window.location.reload()
            const updateStatus = document.getElementById("updateStatus")
            updateStatus.innerText = "Name updated successfully!"
        } else{
            updateStatus.innerText = `Update failed: ${data.message}`
        }
    } catch (err) {
        console.log(err);
        updateStatus.innerText = "An error occurred while updating the name.";
    }
})