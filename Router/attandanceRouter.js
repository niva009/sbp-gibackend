const express = require('express');
const atttandanceRouter = express.Router();
const { addAttandance, markedAttandeList } = require("../controllers/atttandanceController");
const Authorization = require('../middleware/auth');

atttandanceRouter.post("/mark-attandance",Authorization, addAttandance);
atttandanceRouter.get("/view-marked-attandaace", markedAttandeList);

module.exports = atttandanceRouter;
