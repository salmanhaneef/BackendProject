import dotenv from"dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path: "./.env"
})
console.log("Starting")
console.log(process.env.MONGODB_URI)

connectDB()

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


