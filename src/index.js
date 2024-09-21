import dotenv from"dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})
console.log("Starting")
console.log(process.env.MONGODB_URI)

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    
    }).catch((error) => {
    console.error("Error connecting to MongoDB",error)
})

// // //first method of connection 
// // import express from "express"
// // const app = express()
// // ; (async () => {
// //     try {
// //         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// //         app.on("error", (error) => {
// //             console.error("MongoDB connection error:", e)
// //             throw error
// //         })
// //         app.listen(process.env.PORT,()=> {
// //             console.log(`Server is running on port ${process.env.PORT}`)
// //         })
// //     } catch (error) { 
// //         console.log("Error", error)
// //         throw error
// //     }

// // })()


