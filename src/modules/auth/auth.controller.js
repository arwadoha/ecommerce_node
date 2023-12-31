import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../../services/cloudinary.js";
import  jwt from'jsonwebtoken';
export const signUp = async(req,res)=>{
    
    const {userName,email,password} =req.body;

    const user =await userModel.findOne({email});
    if(user){
        return res.status(409).json({message:"Email already exists"})
    }

    const hashedPassword=await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));

    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APP_NAME}/users`
    });

    const createUser =await userModel.create({userName,email,password:hashedPassword, image:{secure_url,public_id}});

    return res.status(201).json({message:"success",createUser})
}

export const signIn =async(req,res)=>{
    const {email,password} =req.body;
    const user =await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"data invaled"})
    }
    const match =await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(400).json({message:"Invalid data"})
    }

    const token =jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINSECRET,
        {expiresIn:'5h'});

    const refreshToken=jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINSECRET,
        {expiresIn: 60*60*24*30 });
    return res.status(200).json({message:"success",token,refreshToken})
}