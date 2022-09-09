//this file if for establishing connection with database(mongo db)
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose=require('mongoose');
require('dotenv').config() // this is used for using .env in this file and installed package is dotenv

const URI= process.env.MONGODBCLOUD

const connectToMongoDb=()=>{
    mongoose.connect(URI).then(()=>{
        console.log("connected to mongo db succesfully");
    }).catch((err)=>{
        console.log("did not connect to db");
        console.log(err.message);
    })
}
module.exports=connectToMongoDb;
