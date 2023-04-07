const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const compression = require("compression");
const expressHandlebars = require("express-handlebars");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");

//////////////////////////////////////////

// Create a transporter object to send emails
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.G_USERNAME, // Your email address
        pass: process.env.G_PASSWORD, // Your email password
    },
});

///////////////////////////////////////////////////////////

// ! Disable x-powered-by in all your project for security reasons
app.disable("x-powered-by");

///////////////////////////////////////////////////////////

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
app.use(cors());

////////// ROUTERS ///////////////////////

app.use(require("./routes/Routes"));

//////////////////////////////////////

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404).render("404");
});

// error handler
app.use(function (err, req, res, next) {
    const errorTemplate = expressHandlebars
        .create()
        .handlebars.compile(fs.readFileSync("./views/error-email.hbs", "utf8"));

    // rendering it
    req.app.get("env") === "development"
        ? console.log(err)
        : // Send the error email
          transporter.sendMail(
              {
                  from: '"Polycarp" <polycarpnwaeke4@gmail.com> ',
                  to: process.env.G_USERNAME,
                  subject: "Error Occurred",
                  generateTextFromHtml: true,
                  html: errorTemplate({
                      errorMessage: err.message,
                      errorDetails: `${err.name}
                      
            Error occurred at this line: ${err.line}`,
                      errorStack: err.stack,
                  }),
              },
              function (error, info) {
                  if (error) {
                      console.log(error);
                  } else {
                      console.log("Email sent: " + info.response);
                  }
              }
          );
    if (Object.keys(err).length !== 1) res.status(500).render("500");
});

module.exports = app;
