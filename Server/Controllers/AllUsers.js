import express from "express";
import cloudinary from "cloudinary";
import Users from "../Modals/Users.js";
import UserImage from "./UserImage.js";

const AllUser = express();

cloudinary.config({
  cloud_name: process.env.Cloudinary_Name,
  api_key: process.env.Cloudinary_APIKEY,
  api_secret: process.env.Cloudinary_SECRET,
  secure: true,
});

AllUser.get("/GetUsers", async (req, res) => {

  try {
   
   const data = await Users.find({});
   
    res.status(200).json({ valid: true , data:data });
  } catch (error) {
    console.log(error);
  }
});


AllUser.post("/CreateUser", async (req, res) => {

    const { userId , password} = req.body ; 
    console.log(req.body)
  const uploadPhoto = await cloudinary.v2.uploader.upload(UserImage, {
    upload_preset: "AdminLoom",
    folder: "AdminLoom",
    use_filename: true,
    overwrite: false,
  });

  const image = {
    id: uploadPhoto.public_id,
    url: uploadPhoto.url,
  };

  try {
    await Users.create({
      userId: userId,

      name: "-",

      image: image,

      status: "Created",

      password: password
    });
    res.status(200).json({ valid: true });
  } catch (error) {
    console.log(error);
  }
});

AllUser.get("/ViewUsers", async (req, res) => {

      const {SelectedUsers} = req.query;
  try {
   
   const data = await Users.find({userId:{$in : SelectedUsers}});
   
    res.status(200).json({ valid: true , data:data });
  } catch (error) {
    console.log(error);
  }
});

AllUser.post("/CheckUsers", async (req, res) => {

  const {id , password} = req.body;
try {

const data = await Users.find({userId:id , password:password});

if(data){
  res.status(200).json({ valid: true , data:data });

}
else{
  res.status(200).json({ valid: false });

}

} catch (error) {
console.log(error);
}
});


AllUser.post("/UpdateUser", async (req, res) => {

  const {id , name , image} = req.body;
try {

const data = await Users.findOne({userId:id});

    if(data){
      console.log(data);
      await cloudinary.v2.uploader.destroy(data.image.id)

      const uploadPhoto = await cloudinary.v2.uploader.upload(image, {
        upload_preset: "AdminLoom",
        folder: "AdminLoom",
        use_filename: true,
        overwrite: false,
      });
      
      const Uploadedimage = {
        id: uploadPhoto.public_id,
        url: uploadPhoto.url,
      };
      const main = {
        userId : id,
      
        name:name,
      
        image:Uploadedimage,
      
        status:"Review",
      
        password:data.password,
      }
      await Users.updateOne({userId:id} , main);
      
      res.status(200).json({valid:true})
    }

    else{
      res.status(200).json({valid:false})

    }



} catch (error) {
console.log(error);
}
});



AllUser.get("/getUser", async (req, res) => {

  try {
   const {id} = req.query

   const data = await Users.findOne({userId:id});

    res.status(200).json({ valid: true , data:data });
  } catch (error) {
    console.log(error);
  }
});

AllUser.post("/ApproveUser", async (req, res) => {

  try {
   const {id} = req.body

   const data = await Users.updateOne({userId:id} , {$set:{status:"Accepted"}});

    res.status(200).json({ valid: true , data:data });
  } catch (error) {
    console.log(error);
  }
});

AllUser.post("/DeleteUser", async (req, res) => {

  try {
   const {id} = req.body

  await Users.deleteOne({userId:id});

    res.status(200).json({ valid: true});
  } catch (error) {
    console.log(error);
  }
});


export default AllUser;
