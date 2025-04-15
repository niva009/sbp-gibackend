const express = require('express');
const BillingRouter = express.Router();
const { createManualBillingAddress, createBillingAddress,updateBillingAddress, deleteBillingAddress } = require('../controllers/billingAddressController');


const Authorization = require('../middleware/auth');

// Create a new billing address 
BillingRouter.post('/create-billing-address', createManualBillingAddress);
BillingRouter.post('/create-order-address', createBillingAddress);

// Update an existing billing address   
BillingRouter.put('/update-billing-address/:id', Authorization, updateBillingAddress);

// Delete a billing address
BillingRouter.delete('/delete-billing-address/:id', Authorization, deleteBillingAddress);



module.exports = BillingRouter;