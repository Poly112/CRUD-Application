// ! Depends on form.js, so it should be placed below form.js
document.querySelector("form").addEventListener("submit", async (e) => {
    const addUserBtn = document.querySelector("#addUser > div.button > button");

    // To prevent sending the same request twice
    addUserBtn.setAttribute("disabled", true);

    e.preventDefault();
    try {
        const firstName = document.querySelector("#firstName");
        const lastName = document.querySelector("#lastName");
        const email = document.querySelector("#email");
        const photo = document.querySelector("#photo");
        const bio = document.querySelector("#bio");

        const formData = new FormData();
        formData.append("firstName", firstName.value);
        formData.append("lastName", lastName.value);
        formData.append("email", email.value);
        formData.append("photo", photo.files[0]);
        formData.append("bio", bio.value);
        const res = await fetch("http://localhost:8080/addUser", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        if (data.success) {
            // TODO: Display the alert using express sessions and cookies
            alert("Submission successful");
            window.location.href = `http://localhost:8080/user?email=${email.value}`;
        } else {
            alert(data.message);
            addUserBtn.removeAttribute("disabled");
        }
    } catch (error) {
        alert("An error occurred. Please try again later.");
        addUserBtn.removeAttribute("disabled");
    }
});
