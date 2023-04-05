const header = document.querySelector("header");
const menuBar = document.querySelector(".fa-bars");
const closes = document.querySelector(".fa-x");
const nav = document.querySelector("nav.nav");

menuBar.addEventListener("click", () => {
    menuBar.classList.toggle("invisible");

    header.classList.add("show");

    nav.classList.add("live");
});

closes.addEventListener("click", () => {
    menuBar.classList.toggle("invisible");

    header.classList.remove("show");

    nav.classList.remove("live");
});
