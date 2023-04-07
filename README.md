# CRUD-Application

## routes/Router.js
The Router.js module exports two classes, Validate and Router.

### Validate class
The Validate class is used to perform validation checks for the user input data. It includes the following methods:

+ constructor: This method is used to instantiate the class and call the Controller method.
+ email: This method takes an email address as an argument and validates it against a regular expression. If the email is invalid, it throws an error with the message "Invalid Email".
+ bio: This method takes a string as an argument and validates it against a regular expression. If the string is invalid, it throws an error with the message "Invalid Bio".
+ name: This method takes a string and an index as arguments. It validates the string against a regular expression and throws an error with the message "Invalid First Name" or "Invalid Last Name", depending on the value of the index, if the string is invalid.
+ photo: This method takes a file object as an argument and validates it based on its mimetype and size. If the file is not an image or is larger than 5MB, it throws an error with the message "Incorrect format" or "File must be smaller than 5MB", respectively.
+ validLength: This method takes a string as an argument and checks its length. If the string is empty or longer than 30 characters, it throws an error with the message "Its should not be empty" or "It should have a maximum of 30 characters", respectively.
+ controller: This method takes an element and an index as arguments and calls the appropriate validation method based on the value of the index.

### Router class
The Router class is used to handle HTTP requests and responses. It includes the following methods:

+ constructor: This method is used to instantiate the class and call the controller method.
+ controller: This method takes a req, res, and next as arguments and handles the routing logic for the HTTP requests. It uses the switch statement to determine the appropriate method to call based on the URL and HTTP method of the request.
+ addUser: This method is called when a POST request is made to the /addUser endpoint. It uses the Validate class to validate the user input data and saves the user data to the database. If the request includes a photo, it saves the photo to the uploads directory and updates the user's photo field in the database with the photo's filename.
+ users: This method is called when a GET request is made to the /users endpoint. It retrieves all users from the database and sends them as a JSON response. If a user has a photo, it reads the photo from the uploads directory and sends it as a response.
+ user: This method is called when a GET request is made to the /user endpoint with an email query parameter. It retrieves the user with the specified email address from the database and sends it as a JSON response. If the user has a photo, it reads the photo from the uploads directory and sends it as a response.
+ edit: This method is called when a GET request is made to the /edit endpoint with an email query parameter. It retrieves the user with the specified email address from the database and sends it as a JSON response. If the user has a photo, it reads the photo from the uploads directory and sends it as a response.
+ update: This method is called when a PUT request is made to the /edit endpoint. It uses the Validate class to validate


## bin/www
This is the entry point of the application. It creates an HTTP server and sets up scaling with node clusters.

- The code first requires the necessary modules and sets up a server on the port specified in the environment variable PORT or 8080 by default.
- It gets the number of CPUs available and forks a worker process for each CPU.
- Each worker process creates a connection to the database and synchronizes the User model schema.
- Finally, the server is started and listening on the specified port, and event listeners for errors and listening are added.


## app.js
This file contains the main application code. It sets up the Express application, configures the view engine and routing.

- The code first requires the necessary modules, including the Express framework, and sets up an instance of the Express application.
- It creates a nodemailer transporter object for sending emails using the Gmail SMTP server.
- The express-handlebars view engine is set up and configured to use the main.hbs layout file.
- Logging middleware, body parsing middleware, cookie parsing middleware, and static file serving middleware are added to the application's middleware stack.
- A route handler for handling requests to the app's routes defined in Routes.js is added.
- A catch-all 404 error handler is added, which renders the 404.hbs view template.
- An error handling middleware function is added to handle any errors that occur during the application's execution. It logs the error to the console in development mode or sends an email containing the error details to the developer's email address in production mode.

