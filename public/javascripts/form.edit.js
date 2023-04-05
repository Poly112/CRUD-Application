// ! Depends on form.js, so it should be placed below form.js
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // To prevent sending the same request twice
    const addUserBtn = document.querySelector("#addUser > div.button > button");

    addUserBtn.setAttribute("disabled", true);

    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const email = document.querySelector("#email");
    const oldEmail = document.querySelector("#oldEmail");
    const photo = document.querySelector("#photo");
    const bio = document.querySelector("#bio");

    const formData = new FormData();
    formData.append("firstName", firstName.value);
    formData.append("lastName", lastName.value);
    formData.append("email", email.value);
    formData.append("oldEmail", oldEmail.value);
    if (photo.files[0]) formData.append("photo", photo.files[0]);
    formData.append("bio", bio.value);

    try {
        const res = await fetch("http://localhost:8080/edit", {
            method: "PUT",
            body: formData,
        });
        const data = await res.json();
        if (data.success) {
            // TODO: Display this alert using express sessions and cookies
            alert("Submission successful");
            window.location.href = `http://localhost:8080/user?email=${email.value}`;
        } else {
            alert(data.message);
            // Enable the send button when the request fails
            addUserBtn.removeAttribute("disabled");
        }
    } catch (err) {
        // Enable the send button when an error occurs
        alert("An error occurred while submitting the form");
        addUserBtn.removeAttribute("disabled");
    }
});
