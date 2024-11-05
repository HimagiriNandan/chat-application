import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js"
import mongoose from "mongoose";
export const searchContacts = async (req, res, next)=>{
  try{
    
    const {searchTerm} = req.body;
    if(searchTerm === undefined || searchTerm === null){
      return res.status(400).send("searchTerm is required.");
    }
    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSearchTerm, "i");
    //while searching for contacts the current logged user should not be there. So we wrote this query...
    const contacts = await User.find({
      $and: [{_id: {$ne: req.userId} }, 
      {
        $or: [{email: regex}, {firstName: regex}, {lastName: regex}]
      }],
    });
    return res.status(200).json({contacts});
  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};

export const getContactsForDMList = async (req, res, next)=>{
  try{
    let {userId} = req;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match:{
          $or: [{sender: userId}, {recipent: userId}],
        },
      },
      {
        $sort: { timeStamp: -1},
      },
      {
        $group: {
          _id: {
            $cond:{
              if:{$eq: ["$sender", userId]},
              then: "$recipent",
              else: "$sender",
            },
          },
          lastMessageTime: {$first: "$timeStamp"},
        },
      },
      {
        $lookup:{
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: "$contactInfo._id",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          email: "$contactInfo.email",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
          lastMessageTime: 1,
        },
      },
      {
        $sort: {lastMessageTime: -1},
      },

    ]);
    
    return res.status(200).json({contacts});
  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};


export const getAllContacts = async (req, res, next)=>{
  try{
    
    const users = await User.find({_id : {$ne: req.userId}}, "firstName lastName _id email");
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email, value: user._id,
    }))
    return res.status(200).json({contacts});
  }catch(e){
    return res.status(500).send("Internal Server Error");
  }
};