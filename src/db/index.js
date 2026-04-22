import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB = async()=>{
    try {
       const conncectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n Mongodb Connected !! DB HOST : ${conncectionInstance.connection.host} `)
    } catch (error) {
        console.log("Error", error)
        process.exit(1)
    }
}
export default connectDB;