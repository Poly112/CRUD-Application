#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require("../app");
const http = require("http");
const User = require("../DB/model");
const sequelize = require("../DB/dbConfig");


/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "8080");

app.set("port", port);

const server = http.createServer(app);

/////////////////////
/**
 * Scaling with node clusters
 */

const cluster = require("cluster");
const os = require("os");

// Get number of CPUs
const numCpu = os.cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCpu; i++) {
        cluster.fork();

        cluster.on("exit", () => {
            cluster.fork();
        });
    }
} else {
    /////////////////////////////////////////////////////

    ////// TESTING CONNECTION  ////////

    const initDB = async () => {
        console.log("Testing the database connection..");

        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Synchronize the User model
        await User.sync();
    };

    // Initialize the application
    (async () => {
        try {
            try {
                // Connect to the database and synchronize models
                await initDB();
            } catch (error) {
                console.error("Error initializing application:", error);
            }
        } catch (error) {
            console.error("Error initializing application:", error);
        }
    })();

    // Start the server
    server.listen(app.get("port"), () => {
        console.log(`server started process ${process.pid} on port ${port}`);
    });
    server.on("error", onError);
    server.on("listening", onListening);
}

/////////////////////////

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        // throw error;
        console.log(error);
        return;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);

        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
}
