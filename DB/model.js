import { Sequelize, DataTypes, Model } from "sequelize";
import dbConfig from "./dbConfig.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operationsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

export const User = sequelize.define("User", {
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
});

export default sequelize;
