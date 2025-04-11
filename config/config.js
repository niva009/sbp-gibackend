const mongoose = require('mongoose');

require('dotenv').config();

const mongodb = process.env.DB_URL||"/localhost:27017/";


const connectDb = async() =>{
    try{
        mongoose.connect(mongodb, {
        });
        console.log("db connection success")
    } catch(error){
        console.log("database connection error", error);
    }
}

module.exports = connectDb;

