///////////////////////////////////////////////////

const next = document.querySelector(".prev");
const prev = document.querySelector(".next");
const table = document.querySelector("table");
const accordions = document.querySelector(".accordions");
let beginning = 0;
let end = 6;
let pageNum = 1;
let data = [];
// Pages
let pageNumber = document.querySelector(".page");
let totalPages = document.querySelector(".totalPages");
async function getUserData() {
    try {
        const response = await fetch("http://localhost:8080/users");
        data = await response.json();
    } catch (error) {
        alert("Refresh failed");
    }
    return data;
}

function getUsersAndRender() {
    try {
        pageNumber.textContent = pageNum;
        totalPages.textContent = getTotalPages(data.users.length);

        if (data.users.length < 1) return;
        let toBeRendered = data.users.slice(beginning, end);
        let sliced = render(
            toBeRendered,
            table.style.display !== "none" ? "table" : ""
        );

        if (table.style.display !== "none") {
            table.innerHTML =
                `<tr>
                        <th scope="col">#</th>
                        <th scope="col">Photo</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                    </tr>` + sliced;
        } else {
            accordions.innerHTML = sliced;
        }
    } catch (error) {
        return alert("Error ocurred while rendering");
    }

    // This script will only run for /users page
    // Buttons
    const deleteButton = document.querySelector("a.delete-btn");
    const editButton = document.querySelector("a.edit-btn");
    const userClick = document.querySelector("td#email");

    function userClickHandler() {
        if (table.style.display == "none") {
            window.location.href = `http://localhost:8080/user?email=${userClick.textContent.trim()}`;
        } else {
            window.location.href = `http://localhost:8080/user?email=${userClick.textContent.trim()}`;
        }
    }

    async function deleteClick(e) {
        e.preventDefault();
        const email = deleteButton.parentElement.parentElement
            .querySelector("td#email")
            .innerText.trim();

        try {
            const res = await fetch(
                `http://localhost:8080/user?email=${email}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (data.success) {
                deleteButton.parentElement.parentElement.innerHTML = "";
                // TODO: Re-render the page
                getUserData();
                getUsersAndRender();
            } else {
                throw new Error("Delete unsuccessful");
            }
        } catch (err) {
            alert(err.message);
        }
    }

    function editClick(e) {
        e.preventDefault();
        const email = document
            .querySelector("main.users")
            .querySelector("#email").innerText;
        if (e.target.tagName.toUpperCase() === "A") {
            e.target.href = `http://localhost:8080/edit?email=${email}`;
            e.target.click();
        }
    }

    prev.addEventListener("click", prevClick);
    next.addEventListener("click", nextClick);
    userClick.addEventListener("click", userClickHandler);
    editButton.addEventListener("click", editClick);
    deleteButton.addEventListener("click", deleteClick);
}

function render(array, elt) {
    if (elt === "table") {
        let number = 1;
        const result = array
            .map(
                ({ firstName, lastName, photo, email, bio }) => `
        <tr class="click">
          <td>${number++}</td>
          <td class="photo">
            <img src="${
                photo ? photo : "/images/pexels-pixabay-220453 (1).jpg"
            }" alt=""/>
          </td>
          <td>${firstName} ${lastName}</td>
          <td id="email">${email}</td>
          <td class="action">
            <a href="#" class="delete-btn">
              <button type="button" class="delete">
                Delete
                <i class="fas fa-trash-alt"></i>
              </button>
            </a>
            <a href="http://localhost:8080/edit?email=${email}" class="edit-btn">
              <button type="button" class="edit">
                Edit
                <i class="fas fa-plus-square"></i>
              </button>
            </a>
          </td>
        </tr>
      `
            )
            .join("");
        return result;
    } else {
        const result = array
            .map(
                ({ firstName, lastName, photo, email, bio }) => `
        <div class="single">
          <button class="accordion">
            <p>${lastName} ${firstName}</p>
            <img src="${photo}" alt=""/>
          </button>
          <div class="panel">
            <label>Email<p id="email click">${email}</p></label>
            <label>Bio<p>${bio}</p></label>
            <div class="action">
              <a href="#" class="delete-btn">
                <button type="button" class="delete">
                  Delete
                  <i class="fas fa-trash-alt"></i>
                </button>
              </a>
              <a href="http://localhost:8080/edit?email=${email}" class="edit-btn">
                <button type="button" class="edit">
                  Edit
                  <i class="fas fa-plus-square"></i>
                </button>
              </a>
            </div>
          </div>
        </div>
      `
            )
            .join("");
        return result;
    }
}

function getTotalPages(num) {
    return Math.ceil(num / 5);
}

function prevClick(e) {
    e.preventDefault();
    if (pageNum == 1) {
        alert("First Page reached");
    } else {
        pageNum--;
    }
    beginning -= 5;
    end -= 5;
    getUsersAndRender();
}

function nextClick(e) {
    e.preventDefault();
    if (pageNum == getTotalPages(data.length)) {
        alert("Last Page reached");
    } else {
        pageNum++;
    }
    beginning += 5;
    end += 5;
    getUsersAndRender();
}

window.addEventListener("load", async () => {
    await getUserData();
    getUsersAndRender();
});

window.addEventListener("resize", async () => {
    await getUserData();
    getUsersAndRender();
});
