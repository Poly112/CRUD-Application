const fs = require("fs");
const path = require("path");
const router = require("express").Router();
const User = require("../DB/model");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

class Validate {
    constructor(element, index) {
        this.controller(element, index);
    }

    email(element) {
        const result = /^[a-z\d\.-]+@[a-z]+\.com$/i.test(element);

        if (!result) {
            throw new Error("Invalid Email");
        }
    }
    bio(element) {
        const result = /^[,\.\w:'"()#;\s]+$/i.test(element);

        if (!result) {
            throw new Error("Invalid Bio");
        }
    }
    name(element, index) {
        const result = /^[a-z]+$/i.test(element);

        if (!result) {
            throw new Error(
                `Invalid ${index == 0 ? "First Name" : "Last Name"} `
            );
        }
    }

    photo(element) {
        if (element === "_") {
            return;
        }
        if (!element.mimetype.startsWith("image/")) {
            throw new Error("Incorrect format");
        }

        if (element.size > 1024 * 1024 * 50)
            throw new Error("File must be smaller tha n 5MB");
    }

    validLength(element) {
        if (element.length > 1) {
            if (element.length < 30) {
                return;
            } else {
                throw new Error("It should have a maximum of 30 characters");
            }
        } else {
            throw new Error("Its should not be empty");
        }
    }

    controller(element, index) {
        switch (index) {
            case 2:
                this.photo(element);
                break;
            case 4:
                this.bio(element);
                break;
            case 3:
                this.email(element);
                this.validLength(element);
                break;
            case 0:
            case 1:
                this.name(element);
                this.validLength(element);
                break;
        }
    }
}

class Router {
    constructor(req, res, next) {
        this.controller(req, res, next);
    }

    controller(req, res, next) {
        req.method = req.method.toUpperCase();
        const { email } = req.query;

        switch (req.url + " | " + req.method) {
            case `/user?email=${email} | GET`:
                this.user(req, res, next);
                break;
            case "/users | GET":
                this.users(req, res, next);
                break;
            case `/user?email=${email} | DELETE`:
                this.delete(req, res, next);
                break;
            case "/addUser | POST":
                this.addUser(req, res, next);
                break;
            case "/edit | PUT":
                this.update(req, res, next);
                break;
            case `/edit?email=${email} | GET`:
                this.edit(req, res, next);
                break;

            default:
                return next();
        }
    }

    async addUser(req, res, next) {
        const { firstName, lastName, email, bio } = req.body;

        try {
            if (req.file) {
                try {
                    [firstName, lastName, req.file, email, bio].forEach(
                        (element, index) => new Validate(element, index)
                    );
                } catch (error) {
                    // FIXME:  Send it to the error handler where it will be sent to my email but not to the client
                    next(error);
                    return res.status(500).json({
                        success: false,
                        message: error.message,
                    });
                }

                // Get the file extension from the uploaded file
                const fileExt = path.extname(req.file.originalname);
                // Generate a unique filename using the current timestamp
                const fileName = Date.now() + fileExt;
                // Define the path where the image will be saved
                const filePath = path.join(process.cwd(), "uploads", fileName);

                // Write the file to the file system
                await fs.promises.writeFile(filePath, req.file.buffer);

                // Save the user data to the database
                await User.create({
                    firstName,
                    lastName,
                    photo: fileName,
                    email,
                    bio,
                });
            } else {
                [firstName, lastName, "_", email, bio].forEach(
                    (element, index) => new Validate(element, index)
                );

                await User.create({ firstName, lastName, email, bio });
            }

            return res.json({ success: true });
        } catch (error) {
            // FIXME:  Send it to the error handler where it will be sent to my email but not to the client
            next(error);
            return res
                .status(500)
                .json({ success: false, message: error.message });
        }
    }
    async users(req, res, next) {
        try {
            const users = await User.findAll();
            const userResponse = await Promise.all(
                users.map(async (user) => {
                    // Get the file path for the user's photo
                    const photoPath = path.join(
                        process.cwd(),
                        "uploads",
                        user.dataValues.photo ? user.dataValues.photo : ""
                    );

                    if (fs.existsSync(photoPath)) {
                        // Read the file from the file system
                        const data = await fs.promises.readFile(photoPath);
                        if (!data)
                            return next(
                                `Photo of ${lastName} ${firstName} Not Found`
                            );

                        // Create a base64 encoded data URL for the image
                        const dataUrl = `data:image/jpeg;base64,${data.toString(
                            "base64"
                        )}`;

                        return {
                            id: user.dataValues.id,
                            firstName: user.dataValues.firstName,
                            lastName: user.dataValues.lastName,
                            email: user.dataValues.email,
                            bio: user.dataValues.bio,
                            // Check if the photo file exists on the file system
                            photo: dataUrl,
                        };
                    }

                    return {
                        id: user.dataValues.id,
                        firstName: user.dataValues.firstName,
                        lastName: user.dataValues.lastName,
                        email: user.dataValues.email,
                        bio: user.dataValues.bio,
                        // Check if the photo file exists on the file system
                        photo: null,
                    };
                })
            );

            return res.json({ success: true, users: userResponse });
        } catch (err) {
            // FIXME:  Send it to the error handler where it will be sent to my email but not to the client
            next(err);
            return res
                .status(500)
                .json({ success: false, message: err.message });
        }
    }

    async delete(req, res, next) {
        const { email } = req.query;

        try {
            const user = await User.findOne({
                where: { email },
            });

            if (user) {
                const filePath = path.join(
                    process.cwd(),
                    "uploads",
                    user.dataValues.photo
                );
                // Delete the file from the file system
                if (fs.existsSync(filePath)) {
                    await fs.promises.unlink(filePath);
                }
            }

            await User.destroy({ where: { email } });

            return res.json({ success: true });
        } catch (error) {
            next(error);
            return res
                .status(500)
                .json({ success: false, message: error.message });
        }
    }
    // Server side
    async edit(req, res, next) {
        try {
            const { email } = req.query;
            let user;
            try {
                user = await User.findOne({
                    where: { email },
                });
                if (!user) return next();
            } catch (error) {
                return next(error);
            }

            const { firstName, photo, lastName, bio } = user.dataValues;
            if (photo) {
                const fileName = photo;
                const filePath = path.join(process.cwd(), "uploads", fileName);

                try {
                    const data = await fs.promises.readFile(filePath);

                    const photoDataUrl = `data:image/png;base64,${data.toString(
                        "base64"
                    )}`;
                    return res.render("edit", {
                        firstName,
                        lastName,
                        email,
                        bio,
                        photo: photoDataUrl,
                    });
                } catch (error) {
                    return next(
                        `PHOTO NOT FOUND: Photo of ${lastName} ${firstName} Not Found`
                    );
                }
            } else {
                return res.render("edit", {
                    firstName,
                    lastName,
                    email,
                    bio,
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // Server side
    async user(req, res, next) {
        const { email } = req.query;
        let user;

        try {
            user = await User.findOne({
                where: { email },
            });

            if (!user) return next();
            const { firstName, lastName, photo, bio } = user.dataValues;

            if (photo) {
                const filePath = path.join(process.cwd(), "uploads", photo);

                try {
                    // Read the file from the file system
                    const data = await fs.promises.readFile(filePath);

                    // Create a base64 encoded data URL for the image
                    const dataUrl = `data:image/jpeg;base64,${data.toString(
                        "base64"
                    )}`;

                    // Render the user view with the image data URL
                    return res.render("user", {
                        firstName,
                        lastName,
                        photo: dataUrl,
                        email,
                        bio,
                    });
                } catch (error) {
                    return next(`Photo of ${lastName} ${firstName} Not Found`);
                }
            } else {
                // Render the user view without an image
                return res.render("user", { firstName, lastName, email, bio });
            }
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        const { firstName, lastName, email, oldEmail, bio } = req.body;

        // Check if an oldEmail was sent
        if (oldEmail) {
            // Check if the user is already part of the database
            const alreadyExist = await User.findOne({
                where: { email: oldEmail },
            });
            // If the user isn't part of the database send a 404 error
            if (!alreadyExist)
                return res.status(500).json({
                    success: false,
                    message: "User hasn't been created yet",
                });
        } else {
            return res
                .status(500)
                .json({ success: false, message: "User cannot be found" });
        }

        try {
            if (req.file) {
                try {
                    // Validate input fields
                    [firstName, lastName, req.file, email, bio].forEach(
                        (element, index) => new Validate(element, index)
                    );
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message,
                    });
                }

                const photo = req.file.buffer;

                // Get the file extension from the uploaded file
                const fileExt = path.extname(req.file.originalname);
                // Generate a unique filename using the current timestamp
                const fileName = Date.now() + fileExt;
                // Define the path where the image will be saved
                const filePath = path.join(process.cwd(), "uploads", fileName);

                // Delete the previous image from the file system
                const { photo: oldPhoto } = await User.findOne({
                    where: { email: oldEmail },
                });
                if (oldPhoto) {
                    const oldFilePath = path.join(
                        process.cwd(),
                        "uploads",
                        oldPhoto
                    );
                    await fs.promises.unlink(oldFilePath);
                }

                // Write the new file to the file system
                await fs.promises.writeFile(filePath, photo);

                // Update the user data in the database
                await User.update(
                    { firstName, lastName, photo: fileName, email: email, bio },
                    {
                        where: {
                            email: oldEmail,
                        },
                    }
                );

                return res.json({ success: true });
            } else {
                try {
                    // Perform validation
                    [firstName, lastName, "_", email, bio].forEach(
                        (element, index) => new Validate(element, index)
                    );
                } catch (error) {
                    return res
                        .status(500)
                        .json({ success: false, message: error.message });
                }
                // No new file was uploaded, so just update the user data in the database
                await User.update(
                    { firstName, lastName, email, bio },
                    {
                        where: {
                            email: oldEmail,
                        },
                    }
                );

                return res.json({ success: true });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message });
        }
    }
}

module.exports = router.all("*", upload.single("photo"), (req, res, next) => {
    new Router(req, res, next);
});
