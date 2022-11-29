const deleteButton = document.querySelector(".delete-btn");

const addUserButton = document.querySelector("#edit-btn");
const editButton = document.querySelector(".edit-btn");

const next = document.querySelector(".prev");
const prev = document.querySelector(".next");
const pageNumber = document.querySelector(".page");
const error = document.querySelector(".error");
const errorImage = document.querySelector(".error-image");
const errorName = document.querySelector(".error-name");
const errorBio = document.querySelector(".error-bio");
const errorEmail = document.querySelector(".error-email");
const imagePreview = document.querySelector(".image-preview");
const photoBtn = document.querySelector(".photo-btn");
const form = document.querySelector("form");

//////////////////////////////////////////
function validateLength(element) {
    if (element.length > 1) {
        if (element.length < 30) {
            return true;
        }
    }
    return false;
}

function validateEmail(element) {
    if (/^[a-z\d]+@[a-z]+\.com$/i.test(element)) {
        return true;
    }
    return false;
}

function validateBio(element) {
    if (/^[,\.\z:;\s]+$/i.test(element)) {
        return true;
    }
    return false;
}

function validateName(element, index) {
    if (/^[a-z]+$/i.test(element)) {
        return true;
    }
    return false;
}

function validatePhoto(element) {
    errorImage.innerHTML = "";
    errorImage.style.display = "none";

    document.querySelector(".preview-image span").style.display = "none";
    imagePreview.style.backgroundColor = "transparent";

    if (element.files) {
        const file = element.file[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            if (reader.readyState == 2)
                document.querySelector("#image").src = reader.result;
        };
    }

    const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
    ];

    if (!allowedImageTypes.includes(element.type)) {
        errorImage.style.display = block;
        error.textContent = "Allowed files are: [.jpeg, .png, .gif]";
        return false;
    }
    if (element.size > 1024 * 1024 * 2) error.style.display = "block";
    error.textContent = "File must be smaller tha n 2MB";
    return false;
}
//////////////////////////////////////////

const fullName = document.querySelector("#name");

const email = document.querySelector("#email");
const photo = document.querySelector("#photo");
const bio = document.querySelector("#bio");

fullName.addEventListener("change", () => {
    if (!validateLength(fullName.value)) {
        errorName.textContent = "Number of letters must be less than 30";
        fullName.value = "";
    } else {
        if (!validateName(fullName.value)) {
            errorName.textContent = "Name must be only letters";
            fullName.value = "";
        }
    }
});
email.addEventListener("change", () => {
    if (!validateLength(email.value)) {
        errorEmail.textContent = "Number of letters must be less than 30";
        email.value = "";
    } else {
        if (!validateEmail(email.value)) {
            errorEmail.textContent = "Input a valid email please";
            email.value = "";
        }
    }
});
bio.addEventListener("change", () => {
    if (!validateBio(bio.value)) {
        errorBio.textContent = "Bio must be letters or numbers";
        bio.value = "";
    }
});

photo.addEventListener("change", () => {
    validatePhoto(photo);
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/users");
    const data = res.json();
    data.forEach(({ email }) => {
        if (email == email.value) {
            errorEmail.textContent = "Email already exist";
        } else {
            form.submit();
        }
    });
});

///////////////////////////////////////////////////

deleteButton.addEventListener("click", async (e) => {
    const email = document
        .querySelector("main.users")
        .querySelector("#email").innerText;

    const res = await fetch(
        "http://localhost:8080/users" +
            new URLSearchParams({
                email,
            }),
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = res.json();

    if (data.Success) {
        email.parentElement.parentElement.innerHTML = "";
    } else {
        alert("Delete unsuccessful");
    }
});

editButton.addEventListener("click", async (e) => {
    const email = document
        .querySelector("main.users")
        .querySelector("#email").innerText;

    const res = await fetch(
        "http://localhost:8080/edit" +
            new URLSearchParams({
                email,
            })
    );

    const data = res.json();

    if (data.Success) {
        email.parentElement.parentElement.innerHTML = "";
    } else {
        alert("Delete unsuccessful");
    }
});
