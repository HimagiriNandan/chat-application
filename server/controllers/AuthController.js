import { compare } from "bcryptjs";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {existsSync, renameSync, unlinkSync} from "fs";
import path from "path";
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  //process.env.JWT_KEY ---> secretkey
  return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge});
};

export const signup = async (req, res, next)=>{
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).send("Email and password is required");
    }
    const user = await User.create({email, password});
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id:user.id,
        email:user.email,
        profileSetup: user.profileSetup,
      },
    });

  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next)=>{
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).send("Email and password is required");
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).send("User not Found.");
    }
    const auth = await compare(password, user.password);
    if(!auth){
      return res.status(401).send("Invalid Password");
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({user: {
      id:user.id,
      email:user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color
    }});

  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next)=>{
  try{
    const userData = await User.findById(req.userId);
    if(!userData){
      return res.status(404).send("User not found");
    }

    
    return res.status(200).json(
      {
        id:userData.id,
        email:userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color
      }
    );

  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next)=>{
  try{
    const {userId} = req;
    const {firstName, lastName, color} = req.body;
    if(!firstName || !lastName){
      return res.status(400).send("Firstname lastname and color is required.");
    }
    const userData = await User.findByIdAndUpdate(userId, {
      firstName, lastName, color, profileSetup:true
    }, {new: true, runValidators: true}); // here new means after updating the data it returns new data. And runValidators means if there is any error in the data it returns error.
    if(!userData){
      return res.status(404).send("User not found");
    }

    
    return res.status(200).json(
      {
        id:userData.id,
        email:userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color
      }
    );

  }catch(e){
    console.log({e});
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res, next)=>{
  try{
    if(!req.file){
      return res.status(400).send("Please upload a file");
    }
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    console.log(fileName);
    renameSync(req.file.path, fileName);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {image:fileName}, 
      {new: true, runValidators: true}
    );
    
    
    return res.status(200).json(
      {
        image: updatedUser.image,
      }
    );

  }catch(e){
    console.log({e});
    return res.status(500).send("Internal Server Error");
  }
};


export const removeProfileImage = async (req, res, next)=>{
  try{
    const {userId} = req;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).send("User not found");
    }
    if(user.image){
      const imagePath = path.resolve(user.image);

      if(existsSync(imagePath)){
        unlinkSync(user.image);
      }
      else{
        console.log("Image file does not exist.")
      }
    }

    user.image = null;
    await user.save();

    
    return res.status(200).send("Profile Image removed Successfully");

  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};

export const logOut = async (req, res, next)=>{
  try{
    
    res.cookie("jwt", "", {maxAge:1, secure:true, sameSite: "None"});
    return res.status(200).send("Logout Successful.");

  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};