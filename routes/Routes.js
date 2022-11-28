import sequelize from "../DB/model.js";
import { User } from "../DB/model.js";
import path from "path";

class Validate {
    constructor(element, index) {
        this.controller(element, index);
    }

    email(element) {
        const result = /^[a-z\d]+@[a-z]+\.com$/i.test(element);

        if (!result) {
            throw new Error("Invalid Email");
        }
    }
    bio(element) {
        const result = /^[,\.\z:;\s]+$/i.test(element);

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
        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/jpg",
        ];

        if (!allowedImageTypes.includes(element.type)) {
            throw new Error("Incorrect format");
        }
        if (element.size > 1024 * 2) throw new Error("Maximum size exceeded");
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
            case 1:
                this.photo(element);
                break;
            case 3:
                this.bio(element);
                break;
            case 2:
                this.email(element);
                this.validLength(element);
                break;
            case 0:
                this.name(element);
                this.validLength(element);
                break;
        }
    }
}

class Router {
    constructor(err, req, res, next) {
        this.controller(err, req, res, next);
    }

    controller(req, res, next) {
        req.method = req.url.toUpperCase();
        switch (req.url + " | " + req.method) {
            case "/ | GET":
                this.home(res);
                break;
            case "/user | GET":
                this.user(req, res, next);
                break;
            case "/users | GET":
                this.users(req, res);
                break;
            case "/users | DELETE":
                this.delete(req, res);
                break;
            case "/addUser | POST":
                this.addUser(req, res, next);
                break;
            case "/addUser | PUT":
                this.update(req, res);
                break;
            case "/edit | GET":
                this.edit(req, res, next);
                break;

            default:
                throw new Error("Page doesn't exist");
        }
    }

    home(res) {
        res.sendFile(path.resolve("public", "index.html"));
        return;
    }

    addUser(req, res, next) {
        const { fullName, photo, email, bio } = req.body;
        [fullName, photo, email, bio].forEach(
            (element, index) => new Validate(element, index)
        );
        User.create({ fullName, photo, email, bio })
            .then(() => res.json(JSON.stringify({ Success: true })))
            .catch(() => {
                res.json(JSON.stringify({ Success: false }));
                next();
            });
    }

    async users(req, res) {
        try {
            const users = await User.findAll();
            res.json(JSON.stringify(users));
        } catch (error) {
            throw new Error("Database Failure: Fetching Data Failed");
        }
    }

    delete(req, res) {
        const { email } = req.params;

        try {
            User.destroy({
                where: { email },
            });

            res.json(JSON.stringify({ Success: true }));
        } catch (error) {
            throw new Error("Database Failure: Deleting Failed");
        }
    }

    edit(req, res, next) {
        const { email } = req.query;
        let user = User.findOne({ email }).catch(next);
        const { fullName, photo, bio } = user;
        res.render("user", { fullName, photo, email, bio });
    }

    user(req, res, next) {
        const { email } = req.query;
        let user = User.findOne({ email }).catch(next);
        const { fullName, photo, bio } = user;
        res.render("user", { fullName, photo, email, bio });
    }
    update(req, res) {
        const { fullName, photo, email, bio } = req.body;
        [fullName, photo, email, bio].forEach(
            (element, index) => new Validate(element, index)
        );
        User.update(
            { fullName, photo, email, bio },
            {
                where: {
                    email: email,
                },
            }
        )
            .then(() => {
                res.json(JSON.stringify({ Success: true }));
            })
            .catch(() => {
                res.json(JSON.stringify({ Success: false }));
                next();
            });
    }
}

export default Router;
