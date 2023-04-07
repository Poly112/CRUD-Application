const addUserButton = document.querySelector("#edit-btn");

// Errors
const error = document.querySelector(".error");
const errorImage = document.querySelector(".error-image");
const error_firstName = document.querySelector(".error-firstName");
const error_lastName = document.querySelector(".error-lastName");
const errorBio = document.querySelector(".error-bio");
const errorEmail = document.querySelector(".error-email");

const imagePreview = document.querySelector(".image-preview");
const photoBtn = document.querySelector(".photo-btn");
// Input elements
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const photo = document.querySelector("#photo");
const bio = document.querySelector("#bio");

//////////////////////////////////////////
//  Validations

function validateLength(element) {
    if (element.length > 1 && element.length < 30) {
        return true;
    }
    return false;
}

function validateEmail(element) {
    if (/^[a-z\d\.-]+@[a-z]+\.com$/i.test(element)) {
        return true;
    }
    return false;
}

function validateBio(element) {
    if (/^[,\.\w:'"()#;\s]+$/i.test(element)) {
        return true;
    }
    return false;
}

function validateName(element) {
    if (/^[a-z]+$/i.test(element)) {
        return true;
    }
    return false;
}

function validatePhoto(element) {
    errorImage.innerHTML = "";
    errorImage.style.display = "none";

    document.querySelector(".image-preview span").style.display = "none";
    imagePreview.style.backgroundColor = "transparent";

    const file = element.files[0];

    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            if (reader.readyState == 2) {
                document.querySelector("#image").src = reader.result;
                document.querySelector("#image").style.display = "block";
            }
        };
    } else {
        // If no file was uploaded, do nothing
        return true;
    }

    if (!file.type.startsWith("image/")) {
        error.style.display = "block";
        error.textContent = "Please select an image file.";
        return false;
    }

    // Check if the file size is within a specified range
    const maxSize = 50 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
        error.style.display = "block";
        error.textContent = "File must be smaller tha n 5MB";
        return false;
    }
}
//////////////////////////////////////////
// Input element

function validateInput(input, error, validationFunction, validateLength) {
    input.addEventListener("change", () => {
        const value = input.value.trim();
        if (!validateLength(value)) {
            error.textContent = "Number of letters must be less than 30";
            input.value = "";
        } else {
            if (!validationFunction(value)) {
                error.textContent = "Input is not valid";
                input.value = "";
            }
            return checkInputs();
        }
    });
}

validateInput(firstName, error_firstName, validateName, validateLength);
validateInput(lastName, error_lastName, validateName, validateLength);
validateInput(email, errorEmail, validateEmail, validateLength);
validateInput(bio, errorBio, validateBio, (data) => true);

photo.addEventListener("change", (e) => {
    validatePhoto(photo);
});

///////////////////////////////////////
// Check if all input has been filled and free of error so as to enable submit button

function checkInputs() {
    const addUserBtn = document.querySelector("#addUser > div.button > button");
    const firstNameValue = firstName.value.trim();
    const lastNameValue = lastName.value.trim();
    const emailValue = email.value.trim();
    const bioValue = bio.value.trim();
    const photoValue = photo.value.trim();

    if (
        firstNameValue !== "" &&
        lastNameValue !== "" &&
        emailValue !== "" &&
        bioValue !== "" &&
        photoValue !== ""
    ) {
        addUserBtn.removeAttribute("disabled");
    } else {
        addUserBtn.setAttribute("disabled", true);
    }
}
////////////////////////////////////////
