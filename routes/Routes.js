import sequelize from "../DB/model.js";
import { User } from "../DB/model.js";
import path from "path";

class Validate {
    constructor(element, index) {
        this.element = element;
        this.index = index;
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
            case 3:
                this.bio(element);
                break;
            case 2:
                this.email(element);
                this.validLength(element);
                break;
            case 1:
            case 2:
                this.name(element);
                this.validLength(element);
                break;
        }
    }
}

class Router {
    constructor(err, req, res, next) {
        this.err = err;
        this.req = req;
        this.id = null;
        this.res = res;
        this.next = next;
        this.controller(err, req, res, next);
        this.refreshArray();
    }

    static array = [];

    controller(req, res, next) {
        switch (req.url) {
            case "/":
                this.home(req, res);
                break;
            case "/addUser":
                this.addUser(req, res, next);
                break;
            case "/users":
                this.users(req, res);
                break;

            default:
                throw new Error("Page doesn't exist");
        }
    }

    home(req, res) {
        res.sendFile(path.resolve("public", "index.html"));
        return;
    }

    addUser(req, res, next) {
        const { firstName, lastName, email, bio } = req.body;
        [firstName, lastName, email, bio].forEach(new Validate());
        User.create({ firstName, lastName, email, bio })
            .then(this.render)
            .catch(next);
    }

    users() {
        this.array.forEach(this.render);
    }

    async render() {
        await this.refreshArray();
        const array = this.array;
        this.res.render("users", { array });
    }

    async refreshArray() {
        this.array = await User.findAll();
    }

    delete(req, res) {
        const { email } = req.params;
        User.destroy({
            where: { email },
        })
            .then(render)
            .catch(next);
    }

    edit(req, res) {
        const { firstName, lastName, bio, email } = req.query;
        let user = User.findOne({ email }).catch(next);
        this.id = user.id;
        res.render("add-user", { firstName, lastName, email, bio });
    }
    update(req, res) {
        const { firstName, lastName, email, bio } = req.body;
        User.update(
            { firstName, lastName, email, bio },
            {
                where: {
                    id: this.id,
                },
            }
        )
            .then(this.users)
            .catch(next);
    }
}

export default Router;
