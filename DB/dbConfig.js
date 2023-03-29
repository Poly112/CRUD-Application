const { Sequelize } = require("sequelize");
require("dotenv").config();

module.exports = new Sequelize(
    process.env.DB,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.HOST,
        dialect: process.env.DB_DIALECT ? process.env.DB_DIALECT : "mysql",
        operationsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);
