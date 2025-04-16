const express = require('express');
const BreakFastRouter = express.Router();
const {  addBreakfastRegistration,
    getAllBreakfastRegistrations} = require('../controllers/breakfaastController');


    BreakFastRouter.post('/breakfast/add-registration',addBreakfastRegistration);
    BreakFastRouter.get('/breakfast/view-registration',getAllBreakfastRegistrations);

    module.exports =BreakFastRouter;
