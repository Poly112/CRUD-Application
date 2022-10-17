import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB,
    dialect: process.env.DB_DIALECT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

export default dbConfig;
