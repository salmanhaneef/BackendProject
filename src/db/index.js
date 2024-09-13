import mongoose from 'mongoose';  
// import dotenv from 'dotenv';  
import { DB_NAME } from '../constants.js';  

// dotenv.config();  

const connectDB = async () => {  
    try {  
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {  
            dbName: DB_NAME  
        });  
        console.log(`Mongo database connected!! DB Host: ${connectionInstance.connection.host}`);  
    } catch (err) {  
        console.error(`Error connecting to MongoDB: ${err.message}`);  
        process.exit(1);  
    }  
};  

export default connectDB;

