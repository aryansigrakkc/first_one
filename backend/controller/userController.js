const userModel=require('../model/userModel.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const create_user=async(req,res)=>{
    try {
       const payload= req.body;
      const encypt_pwd=await bcrypt.hash(payload.password,12)
      payload.password=encypt_pwd;
     const is_email_exist= await userModel.findOne({email:payload.email})
     if(is_email_exist){
       return res.send({status:false,message:"Email already exist"})
     }
    const is_contact_exist= await userModel.findOne({contact:payload.contact})
   
   if(is_contact_exist){
   return res.send({status:false,message:"Contact already exist"})
   }

     const create_user= await userModel.create(payload)
     if(create_user){
        res.send({status:true,message:"User created successfully"})
     }
     else{
        res.send({status:false,message:"Failed to create user"})
     }
        
    } catch (error) {
        res.send({status:false,message:"Something went wrong"})
        
    }
}

const getUser=async(req,res)=>{
    try {
        
     const getData=  await userModel.find();
     if(getData.length>0){
        res.send({status:true,data:getData})
     }
     else{
        res.send({status:false,message:"Failed to get user"})
     }
        
    } catch (error) {
        res.send({status:false,message:"Something went wrong"})
        
        
    }
}

const deleteUser=async(req,res)=>{
    try {
       const id= req.params.id
     const is_delete=  await userModel.deleteOne({_id:id})
     
     if(is_delete.acknowledged && is_delete.deletedCount===1){
        res.send({status:true,message:"message Deleted successfully"})
     }
     else{
        res.send({status:false,message:"Failed to delete"})
     }
        
    } catch (error) {
        res.send({status:false,message:"Something went wrong"})
        
    }
}


const updateUserById=async(req,res)=>{
    try {
       const id = req.body.abc;
     
     const updateUserById= await userModel.updateOne({_id:id},{$set:req.body})
     
     if(updateUserById.matchedCount===1 && updateUserById.matchedCount===1){

        res.send({status:true,message:"User updated successfully"})
     }else{
        res.send({status:false,message:"user not updated"})
     }
        
    } catch (error) {
        res.send({status:false,message:"Something went wrong"})
        
    }
}


const loginUser = async (req, res) => {
  try {
    const is_email = await userModel.findOne({ email: req.body.email });

    if (!is_email) {
      return res.send({ status: false, message: "Email not exist!" });
    }

    const is_valid_password = await bcrypt.compare(req.body.password, is_email.password);

    if (is_valid_password) {
      // ✅ Include role in token
      const data = {
        _id: is_email._id,
        email: is_email.email,
        contact: is_email.contact,
        role: is_email.role || "user" // default role 'user' agar db me na ho
      };

      const token = jwt.sign(data, "this_is_my_secret_Key");
      res.send({ status: true, data: { token: token, role: data.role } }); // role bhi bhej rahe

    } else {
      res.send({ status: false, message: "Invalid Password" });
    }

  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "User login failed" });
  }
};


module.exports={create_user,getUser,loginUser,deleteUser,updateUserById}