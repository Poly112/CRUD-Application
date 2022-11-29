const deleteButton = document.querySelector(".delete-btn");

const addUserButton = document.querySelector("#edit-btn");
const editButton = document.querySelector(".edit-btn");

const next = document.querySelector(".prev");
const prev = document.querySelector(".next");
const pageNumber = document.querySelector(".page");
const totalPages = document.querySelector(".totalPages");
const error = document.querySelector(".error");
const errorImage = document.querySelector(".error-image");
const errorName = document.querySelector(".error-name");
const errorBio = document.querySelector(".error-bio");
const errorEmail = document.querySelector(".error-email");
const imagePreview = document.querySelector(".image-preview");
const photoBtn = document.querySelector(".photo-btn");
const userClick = document.querySelector("#click");

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

document.querySelector("form#edit").addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/users");
    const data = JSON.parse(res.json());
    if (
        !data.some(({ email }) => {
            email == email.value;
        })
    ) {
        const formData = new FormData();
        formData.append("fullName", fullName.value);
        formData.append("email", email.value);
        formData.append("photo", photo.files[0]);
        formData.append("bio", bio.value);
        const res = await fetch("http://localhost:8080/edit", {
            method: "PUT",
            body: formData,
        });
        const data = JSON.parse(res.json());
        if (data.Success) {
            alert("Submission successful");
            window.location.href = "http://localhost:8080/users";
        } else {
            alert("Submission Failed");
        }
    } else {
        errorEmail.textContent = "Email already exist";
    }
});
document.querySelector("form#addUser").addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/users");
    const data = JSON.parse(res.json());
    if (
        !data.some(({ email }) => {
            email == email.value;
        })
    ) {
        const formData = new FormData();
        formData.append("fullName", fullName.value);
        formData.append("email", email.value);
        formData.append("photo", photo.files[0]);
        formData.append("bio", bio.value);
        const res = await fetch("http://localhost:8080/edit", {
            method: "POST",
            body: formData,
        });
        const data = JSON.parse(res.json());
        if (data.Success) {
            alert("Submission successful");
            window.location.href = "http://localhost:8080/users";
        } else {
            alert("Submission Failed");
        }
    } else {
        errorEmail.textContent = "Email already exist";
    }
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
});

function render(array, elt) {
    if (elt == "table") {
        let result = "";
        let number = 1;

        array.forEach(({ fullName, photo, email, bio }) => {
            result += `                <tr id="click">
            <td>${number}</td>
            <td class="photo">
                <img
                    src="${photo}"
                    alt=""
                />
            </td>
            <td>${fullName}</td>
            <td id="email">${email}</td>
            <td class="action">
                <a href="#" class="delete-btn">
                    <button type="button" class="delete">
                        Delete
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </a>
                <a href="./addUser.html " class="edit-btn">
                    <button type="button" class="edit">
                        Edit
                        <i class="fas fa-plus-square"></i>
                    </button>
                </a>
            </td>
        </tr>`;
            number++;
        });
        return result;
    } else {
        let result = "";
        array.forEach(({ fullName, photo, email, bio }) => {
            result += `
            <div class="single">
            <button class="accordion">
                <p>${fullName}</p>
                <img
                    src="${photo}"
                    alt=""
                />
            </button>
            <div class="panel">
                <label
                    >Email
                    <p id="email click">${email}</p></label
                >
                <label
                    >Bio
                    <p>
                        ${bio}
                    </p>
                </label>
                <div class="action">
                    <a href="#" class="delete-btn">
                        <button type="button" class="delete">
                            Delete
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </a>
                    <a
                        href="http://localhost:8080/edit"
                        class="edit-btn"
                    >
                        <button type="button" class="edit">
                            Edit
                            <i class="fas fa-plus-square"></i>
                        </button>
                    </a>
                </div>
            </div>
        </div>
            `;
        });

        return result;
    }
}

function getTotalPages(num) {
    const pages = num / 5;
    if (Maths.floor(pages) < pages) {
        return Maths.floor(pages) + 1;
    } else {
        return Maths.floor(pages);
    }
}

document.querySelector("main.users").addEventListener("load", () => {
    const res = fetch("http://localhost:8080/users");
    const data = JSON.parse(res.json());
    const table = document.querySelector("table");
    const accordions = document.querySelector(".accordions");
    let beginning = 0;
    let end = 0;
    let pageNum = 1;
    let toBeRendered = null;
    let sliced = null;
    pageNumber.textContent = pageNum;
    totalPages.textContent = getTotalPages(data.length);

    if (!table.style.display == "none") {
        toBeRendered = data.slice(beginning, end);
        sliced = render(toBeRendered, "table");
        table.innerHTML =
            `               <tr>
        <th scope="col">#</th>
        <th scope="col">Photo</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Action</th>
    </tr>` + sliced;
    } else {
        sliced = render(toBeRendered);
        accordions.innerHTML = sliced;
    }

    prev.addEventListener("click", (e) => {
        e.preventDefault();
        if (pageNum == 1) {
            alert("First Page reached");
        } else {
            pageNum--;
        }
        if (beginning - 5 < 0) {
            beginning = 0;
            end = 6;
        } else {
            beginning -= 5;
            end -= 5;
        }
    });
    next.addEventListener("click", (e) => {
        e.preventDefault();
        if (pageNum == getTotalPages(data.length)) {
            alert("Last Page reached");
        } else {
            pageNum++;
        }
        if (beginning + 5 > 0) {
            beginning = beginning;
            end = end;
        } else {
            beginning += 5;
            end += 5;
        }
    });

    userClick.addEventListener("click", () => {
        if (table.style.display == "none") {
            window.location.href = `http://localhost:8080/user/:${userClick.textContent.trim()}`;
        } else {
            const email = userClick.querySelector("#email");
            window.location.href = `http://localhost:8080/user/${email.textContent.trim()}`;
        }
    });
});
