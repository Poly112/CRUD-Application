import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import Router from "./routes/Routes.js";
import handlebar from "express3-handlebars";
const handlebars = handlebar.create({ defaultLayout: "layout" });

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

const app = express();

import sequelize from "./DB/model.js";

//////////// SETTING UP HANDLEBARS ////////////////

app.engine("handlebars", handlebars.engine);
app.set("view engine", "hbs");

/////////////////////////////////////////////////////

////// TESTING CONNECTION  ////////

try {
    await sequelize.authenticate();
    console.log("Connection established");
} catch (error) {
    console.log("Unable to connect", error);
}

/////////////////////////////

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

////////// ROUTERS ///////////////////////

// app.use("/", );
// app.use("/users", usersRouter);
// app.use(new Router(err, req, res, next))

//////////////////////////////////////

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

export default app;
