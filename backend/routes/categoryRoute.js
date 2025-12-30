const router=require('express').Router();
const {createCategory,getCategory,deleteCategory,updateCategory,getCategoryById}=require('../controller/categoryController')
router.post("/create-category",createCategory)
router.get("/get-category",getCategory)
router.post("/delete-category/:id",deleteCategory)
// router.patch("/update-category/:id",updateCategory) jab params se id nikala jaye to aise route hota hai
router.patch("/update-category", updateCategory); // 🔁 No :id jaid niakala jaye to aise route hota hai

router.get('/get-category:id', getCategoryById); 

module.exports=router


