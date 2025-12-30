const router=require("express").Router();

router.use("/register",require("./userRoutes"))
router.use("/category",require("./categoryRoute"))
router.use("/blog",require("./blogRoute"))



module.exports=router