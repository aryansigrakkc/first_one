const categoryModel = require('../model/categoryModel');

const createCategory = async (req, res) => {
    try {
        const payload = req.body;
        const create_category = await categoryModel.create(payload);
       
        

        if (create_category) {
            res.send({ status: true, message: "Category created successfully" });
        } else {
            res.send({ status: false, message: "Failed to create category" });
        }

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send({ status: false, message: "Something went wrong",
            error: error.message || error
         });
    }
};
const getCategory = async (req, res) => {
    try {
        
        const get_category = await categoryModel.find();

        if (get_category.length>0) {
            res.send({ status: true,data:get_category });
        } else {
            res.send({ status: false, message: "Failed to get category data" });
        }

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send({ status: false, message: "Something went wrong" });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const id=req.params.id;
        
        const is_deleted = await categoryModel.deleteOne({_id:id});

        if (is_deleted) {
            res.send({ status: true,message:"Category Deleted successfully" });
        } else {
            res.send({ status: false, message: "Failed to delete category " });
        }

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send({ status: false, message: "Something went wrong" });
    }
};
const updateCategory = async (req, res) => {
  try {
    const id = req.body._id; 

    const is_updated = await categoryModel.updateOne({ _id: id }, { $set: req.body });

    if (is_updated.modifiedCount > 0) {
      res.send({ status: true, message: "Category updated successfully" });
    } else {
      res.send({ status: false, message: "Failed to update category" });
    }

  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};


const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await categoryModel.findById(id);

        if (category) {
            res.send({ status: true, data: category });
        } else {
            res.send({ status: false, message: "Category not found" });
        }

    } catch (error) {
        console.error("Error getting category by ID:", error);
        res.status(500).send({ status: false, message: "Something went wrong", error: error.message });
    }
};




module.exports = { createCategory,getCategory,deleteCategory,updateCategory,getCategoryById};
