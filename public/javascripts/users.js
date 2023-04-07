///////////////////////////////////////////////////

const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
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
        let slicedTable = render(toBeRendered, "table");
        let slicedAccordions = render(toBeRendered);

        table.innerHTML =
            `<tr>
                        <th scope="col">#</th>
                        <th scope="col">Photo</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                    </tr>` + slicedTable;

        accordions.innerHTML = slicedAccordions;
    } catch (error) {
        return alert("Error ocurred while rendering");
    }

    // This script will only run for /users page
    // Buttons

    const deleteButtons = document.querySelectorAll("a.delete-btn");
    const editButtons = document.querySelectorAll("a.edit-btn");

    const userClicks = document.querySelectorAll(".click");

    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            deleteClick(e, btn);
        });
    });
    editButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            editClick(e, btn);
        });
    });
    userClicks.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            userClickHandler(e, btn);
        });
    });

    function userClickHandler(e, btn) {
        if (e.target.classList.contains("click")) {
            if (table.style.display === "none") {
                return (window.location.href = `http://localhost:8080/user?email=${btn
                    .querySelector("#email")
                    .textContent.trim()}`);
            } else {
                return (window.location.href = `http://localhost:8080/user?email=${btn
                    .querySelector("#email")
                    .textContent.trim()}`);
            }
        }
    }

    async function deleteClick(e, btn) {
        e.preventDefault();
        btn.setAttribute("disabled", true);

        if (
            e.target.tagName.toUpperCase() === "A" ||
            e.target.tagName.toUpperCase() === "BUTTON"
        ) {
            let email;
            if (e.target.tagName.toUpperCase() === "A")
                email = e.target.parentElement.parentElement
                    .querySelector("#email")
                    .innerText.trim();
            if (e.target.tagName.toUpperCase() === "BUTTON")
                email = e.target.parentElement.parentElement.parentElement
                    .querySelector("#email")
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
                    if (e.target.tagName.toUpperCase() === "A")
                        return (e.target.parentElement.parentElement.innerHTML =
                            "");
                    if (e.target.tagName.toUpperCase() === "BUTTON")
                        return (e.target.parentElement.parentElement.parentElement.parentElement.innerHTML =
                            "");

                    // TODO: Re-render the page
                    getUserData();
                    getUsersAndRender();
                } else {
                    throw new Error("Delete unsuccessful");
                }
            } catch (err) {
                btn.removeAttribute("disabled");
                return alert(err.message);
            }
        }
    }

    function editClick(e, btn) {
        e.preventDefault();
        btn.setAttribute("disabled", true);
        try {
            if (
                e.target.tagName.toUpperCase() === "A" ||
                e.target.tagName.toUpperCase() === "BUTTON"
            ) {
                let email;
                if (e.target.tagName.toUpperCase() === "A") {
                    email = e.target.parentElement.parentElement
                        .querySelector("#email")
                        .innerText.trim();
                    window.location.href = `http://localhost:8080/edit?email=${email}`;
                }
                if (e.target.tagName.toUpperCase() === "BUTTON") {
                    email = e.target.parentElement.parentElement.parentElement
                        .querySelector("#email")
                        .innerText.trim();

                    window.location.href = `http://localhost:8080/edit?email=${email}`;
                }
            }
        } catch (error) {
            btn.removeAttribute("disabled");
            return alert(error.message);
        }
    }

    prev.addEventListener("click", prevClick);
    next.addEventListener("click", nextClick);

    const accordion = document.querySelectorAll(".accordion");

    accordion.forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            const panel = btn.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
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
            <label class="click">Email<p  id="email">${email}</p></label>
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
    if (pageNum === 1) {
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
