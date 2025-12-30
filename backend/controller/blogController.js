const blogModel=require('../model/blogModel.js');
const categoryModel = require('../model/categoryModel.js');

const mongoose = require('mongoose');
const create_blog=async(req,res)=>{
    try {
      const payload= req.body;
     
      
      payload.image=req.file.filename;
     const create_blog= await blogModel.create(payload)
     if(create_blog){
        res.send({status:true,message:"Blog created successfully"})
     }
     else{
        res.send({status:false,message:"Failed to create blog"})
     }
        
    } catch (error) {
        
        res.send({status:false,message:"Something went wrong",error})
        
    }
}

const getBlog = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    let skip = (page - 1) * limit;

    const getData = await blogModel
      .find()
      .populate("category", "name")
      .populate("likes.userId")
      .populate("comments.userId", "name email")
      .skip(skip)
      .limit(limit);

    res.send({ status: true, data: getData });

  } catch (error) {
    res.send({ status: false, message: "Error", error });
  }
};




const deleteUser=async(req,res)=>{
   try {
      const id= req.params.id
    const is_delete=  await blogModel.deleteOne({_id:id})
    console.log(is_delete,"deleted data");
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
//  updateBlog = async (req, res) => {
//   try {
//     const blogId = req.body.id;
//     const updateData = req.body;

//     console.log("Update request body:", updateData);
//     console.log("Update request id:", blogId);

//     const updateResult = await blogModel.updateOne(
//       { _id: blogId },
//       { $set: updateData }
//     );

//     console.log("Update result:", updateResult);

//     if (updateResult.matchedCount === 0) {
//       return res.status(404).json({ status: false, message: 'Blog not found' });
//     }

//     if (updateResult.modifiedCount === 0) {
//       return res.status(200).json({ status: true, message: 'No changes made (data same)' });
//     }

//     return res.status(200).json({
//       status: true,
//       message: 'Blog updated successfully',
//       result: updateResult,
//     });
//   } catch (error) {
//     console.error('Update blog error:', error);
//     return res.status(500).json({ status: false, message: 'Server error' });
//   }
// };



const updateBlog = async (req, res) => {
  try {
    const id = req.body._id;

    const is_updated = await blogModel.updateOne(
      { _id: id },
      { $set: req.body }
    );

    if (is_updated.modifiedCount > 0) {
      res.send({ status: true, message: "Blog updated successfully" });
    } else {
      res.send({ status: false, message: "No changes made or blog not found" });
    }

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};






/* user controller method */
const getBlogByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;   // <-- yaha id use karna hai
    console.log("Category ID:", categoryId);

    const category_name = await categoryModel.findById(categoryId);

    const getBlog = await blogModel.find({ category: categoryId })
      .populate({ path: "category", select: { name: 1 } });

    if (getBlog.length > 0) {
      res.send({
        status: true,
        data: getBlog,
        category_name: category_name?.name || "No name",
      });
    } else {
      res.send({ status: false, message: "Blog not found" });
    }

  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Something went wrong" });
  }
};


const userGetBlog = async (req, res) => {
  try {
    const getData = await blogModel
      .find()
      .populate({ path: "likes.userId", select: "name email" })
      .populate({ path: "comments.userId", select: "name email" });

    if (getData.length > 0) {
      return res.send({ status: true, data: getData });
    } else {
      return res.send({ status: false, message: "Failed to get blog" });
    }

  } catch (error) {
    return res.send({ status: false, message: "Something went wrong", error });
  }
};




/* end here */

// const likeBlog = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     console.log(blogId,"blogggg");
    
//     const userId = req.user._id;
//     console.log(userId,"userididid");
    

//     const blog = await blogModel.findById(blogId);
//     if (!blog) return res.send({ status: false, message: "Blog not found" });

//     const alreadyLiked = blog.likes.find((l) => l.userId.toString() === userId.toString());

//     if (alreadyLiked) {
//       // ➤ Unlike
//       blog.likes = blog.likes.filter((l) => l.userId.toString() !== userId.toString());
//       await blog.save();
//       return res.send({ status: true, message: "Blog unliked", likesCount: blog.likes.length });
//     }

//     // ➤ Like
//     blog.likes.push({ userId });
//     await blog.save();

//     res.send({ status: true, message: "Blog liked", likesCount: blog.likes.length });

//   } catch (error) {
//     res.send({ status: false, message: "Like failed", error });
//   }
// };

const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id; 
    const userId = req.user._id;
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.send({ status: false, message: "Blog not found" });
    }

    const alreadyLiked = blog.likes.find(
      (l) => l.userId.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // UNLIKE
      blog.likes = blog.likes.filter(
        (l) => l.userId.toString() !== userId.toString()
      );

      await blog.save();

      const updatedBlog = await blogModel
        .findById(blogId)
        .populate("likes.userId", "name email");

      return res.send({
        status: true,
        message: "Blog unliked",
        likesCount: updatedBlog.likes.length,
        data: updatedBlog,
      });
    }

    // LIKE
    blog.likes.push({ userId });
    await blog.save();

    const updatedBlog = await blogModel
      .findById(blogId)
      .populate("likes.userId", "name email");

    res.send({
      status: true,
      message: "Blog liked",
      likesCount: updatedBlog.likes.length,
      data: updatedBlog,
    });

  } catch (error) {
    res.send({ status: false, message: "Like failed", error });
  }
};



const addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    // get user info
    const user = req.user; // assuming token middleware ne user attach kiya hai
    // user me name aur email honi chahiye

    const blog = await blogModel.findById(blogId);
    if (!blog) return res.send({ status: false, message: "Blog not found" });

    const newComment = {
      userId,
      name: user.name,
      email: user.email,
      text,
      createdAt: new Date()
    };
console.log("Request body text:", req.body.text);
console.log("User info:", req.user);
    blog.comments.push(newComment);

    await blog.save();

    res.send({ status: true, message: "Comment added", comment: newComment });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: "Comment failed" });
  }
};

// const addComment = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     const userId = req.user._id;
//     const { text } = req.body;

//     if (!text || text.trim() === "") {
//       return res.send({ status: false, message: "Comment text is required" });
//     }

//     // Blog check
//     const blog = await blogModel.findById(blogId);
//     if (!blog) return res.send({ status: false, message: "Blog not found" });

//     // User info fetch
//     const user = await userModel.findById(userId);

//     // Push comment with name and email
//     blog.comments.push({
//       userId,
//       name: user.name,
//       email: user.email,
//       text,
//       createdAt: new Date(),
//     });

//     await blog.save();

//     // Return updated comments
//     res.send({
//       status: true,
//       message: "Comment added successfully",
//       comments: blog.comments,
//       commentsCount: blog.comments.length
//     });

//   } catch (error) {
//     console.log(error);
//     res.send({ status: false, message: "Comment failed", error });
//   }
// };


// ================= UPDATE COMMENT =================
updateComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // from token

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find the comment
    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if logged in user is comment owner
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not allowed to modify this comment" });
    }

    // Update the text
    comment.text = text;

    await blog.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comments: blog.comments,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ================= DELETE COMMENT =================
deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user._id;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check owner
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    // Remove the comment
    blog.comments.pull(commentId);

    await blog.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      comments: blog.comments,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};










module.exports={create_blog,getBlog,userGetBlog,getBlogByCategoryId,deleteUser,updateBlog,likeBlog,addComment,updateComment,deleteComment}