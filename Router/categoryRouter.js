const express = require("express");
const categoryRouter = express.Router();
const authorization = require('../middleware/auth')
const {updateCategory, deleteCategory,addCategory,viewCategory} = require('../controllers/categoryController');


categoryRouter.post("/add-category",authorization, addCategory);
categoryRouter.delete('/delete-category/:id', authorization, deleteCategory);
categoryRouter.put('/update-category/:id',authorization, updateCategory);
categoryRouter.get('/view-category', viewCategory);


module.exports = categoryRouter;