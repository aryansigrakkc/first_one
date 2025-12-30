const router=require('express').Router();
const {create_blog,getBlog,userGetBlog,getBlogByCategoryId,deleteUser,updateBlog,addComment,likeBlog,updateComment,deleteComment}=require("../controller/blogController")
const path = require("path");
const multer  = require('multer')
const { authMiddleware } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+"/uploads")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+"."+file.originalname.split(".")[1])
    }
  })
  
  const upload = multer({ storage: storage })


/*Admin route*/
router.post("/create-blog",upload.single('image'),create_blog)
router.get("/get-blog",getBlog)
router.post("/delete-blog/:id",deleteUser)
router.patch("/update-blog",updateBlog)
router.post("/like/:id", authMiddleware, likeBlog);
router.post("/comment/:id", authMiddleware, addComment);
router.put("/comment/update/:blogId/:commentId", authMiddleware, updateComment);
router.delete("/comment/delete/:blogId/:commentId", authMiddleware, deleteComment);

/*end here*/



/*Frontend route*/
router.get("/user-get-blog",userGetBlog)
router.get("/user-get-blog-by-category/:id",getBlogByCategoryId)

/*end here*/


module.exports=router;