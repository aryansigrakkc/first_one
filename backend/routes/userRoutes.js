const router=require('express').Router();
const {create_user,getUser,loginUser,deleteUser,updateUserById}=require('../controller/userController')


router.post("/create-user",create_user)
router.get("/get-user",getUser)
router.post("/delete-user/:id",deleteUser)
router.patch("/update-user",updateUserById)
router.post("/login-user",loginUser)


module.exports=router;
