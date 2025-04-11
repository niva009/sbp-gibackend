const categorySchema = require("../models/CategorySchema");


const addCategory = async(req , res) =>{

    try {
        const {name,metatitle, metadescription} =req.body;

        if(!name){
            return res.status(400).json({message:"naame field is required", success:false, error:true});
        }

        const category = new categorySchema({
            name,
            metatitle,
            metadescription
        })
       await category.save();

        return res.status(200).json({message:"category saved successfully", success:"true", error:"false", data:category})
    }catch(error){
        return res.status(500).json({message:"internal server error", success:false, error:error})
    }
}

const deleteCategory = async(req,res) =>{

    try {
        const id = req.params.id;

        if(!id){
            return res.status(401).json({message:"category id not found", success:"false", error:true});
        }

        const categoryData = await categorySchema.findByIdAndDelete(id);

        if(!categoryData){
            return res.status(400).json({message:"category data not found!", success:"false", error:"true"});
        }

        return res.status(200).json({message:"cateory deleted succsss", data: categoryData});
    }catch(error){
        return res.status(500).json({messsage:"internal server error", error: error})
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, metaTitle, metadescription } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Category ID is required", success: false, error: true });
        }

        const updatedCategory = await categorySchema.findByIdAndUpdate(
            id,
            { name, metaTitle, metadescription },
            { new: true, runValidators: true } // Returns updated document & applies validation
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found", success: false, error: true });
        }

        return res.status(200).json({ message: "Category updated successfully", success: true, data: updatedCategory });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const viewCategory = async(req,res) =>{

    try {
    const categoryData = await categorySchema.find();

    if(!categoryData){
        return res.status(400).json({message:"category is empty", success:false})
    }
    return res.status(200).json({message:"category daata foaund", data: categoryData, success:"true"});
    }catch(error){
        return res.status(500).json({messge:"internal server error", error:error,  success:"false"});
    }
}


module.exports = {updateCategory, deleteCategory, addCategory, viewCategory}