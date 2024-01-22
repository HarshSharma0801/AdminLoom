import mongoose from "mongoose";


const UsersSchema = mongoose.Schema({

   userId : {type:Number},

   name:{type:String},

   image:{},

   status:{type:String},

   password:{type:String},


})


const Users = mongoose.model('Users' , UsersSchema);


export default Users