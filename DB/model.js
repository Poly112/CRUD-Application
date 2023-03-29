"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./dbConfig");

class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
    toJSON() {
        return { ...this.get(), id: undefined };
    }
}
User.init(
    {
        // attributes
        firstName: {
            type: DataTypes.CHAR,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.CHAR,
            allowNull: false,
        },
        //TODO make email unique
        email: {
            type: DataTypes.CHAR,
            allowNull: false,
            unique: true,
        },

        bio: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        photo: {
            type: DataTypes.CHAR,
            allowNull: true,
        },
    },
    { sequelize, modelName: "User" }
);

// the defined model is the class itself
// console.log(User === sequelize.models.User);

module.exports = User;
