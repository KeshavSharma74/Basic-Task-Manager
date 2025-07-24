import mongoose from "mongoose";
import "dotenv/config"

const connectDb = async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("Database Connected Successfully \nHost :",connectionInstance.connection.host);
    }
    catch(error){
        console.log("Database Connection failed..!!!");
        console(error);
        process.exit(1);
    }
}

export default connectDb;