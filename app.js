const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const Router = require("./routes/Routes");
const expressSession = require("express-session");
const app = express();
const compression = require("compression");
const expressHandlebars = require("express-handlebars");

// compress all responses
app.use(compression());

//////////// SETTING UP HANDLEBARS ////////////////
// !  NOTE THE FOLLOWING:
// ! The layout must be "layouts/main.hbs"

app.engine(
    "hbs",
    expressHandlebars.engine({
        extname: ".hbs",
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");

/////////////////////////////

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

////////// ROUTERS ///////////////////////

app.use(require("./routes/Routes"));

//////////////////////////////////////

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404).render("404");
});

// error handler
app.use(function (err, req, res, next) {
    // rendering it
    console.log(err);
    res.status(500).render("500", {
        message: err.message,
        error: req.app.get("env") === "development" ? err : {},
    });
});

module.exports = app;
