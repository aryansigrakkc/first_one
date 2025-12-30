const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        const mong = await mongoose.connect("mongodb://localhost:27017/first_one");
        console.log("DB Connected!")
    } catch (error) {
        console.log("Failed to DB Connect")
    }
}


module.exports = connectDB;