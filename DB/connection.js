import mongoose, { connect } from "mongoose";

 const connectDB =async()=>{

    return await mongoose.connect(process.env.DB).
    then(() =>{
         console.log("DB connected successfully"); 
    } ).catch( (err)=>{
        console.log(`error to connect db ${err}`);
    } );
 }

 export default connectDB;