const deleteButton = document.querySelector(".delete-btn");

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

function photo(element) {
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
        throw new Error("Incorrect format");
    }
    if (element.size > 1024 * 2) throw new Error("Maximum size exceeded");
}
//////////////////////////////////////////

form.addEventListener("submit", () => {
    let name = document.querySelector("#name");
    let email = document.querySelector("#email");
    let photo = document.querySelector("#photo");
    let bio = document.querySelector("#bio");
});
