const express = require("express")
const app = express();
const userRouter = require("./Router/userRouter");
const categoryRouter = require('./Router/categoryRouter');
const EventRouter = require('./Router/eventRouter');
const CartRouter = require ('./Router/cartRouter');
const BillingRouter = require('./Router/billingRouter');
const orderRouter = require('./Router/orderRouter');
const EventTimeRouter = require('./Router/evnttimeRouter');
const cors = require("cors");
const dbConnection = require('./config/config');
const dotenv = require("dotenv");
const PORT = process.env.PORT || 4001




const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://spbgi-admin.vercel.app',
    'https://hpbgicancersurgerysummit2025.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware for all routes and methods (including OPTIONS)
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Apply same config for preflight




dotenv.config();
dbConnection();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }))

app.use("/api", userRouter);
app.use('/api', categoryRouter);
app.use('/api', EventRouter);
app.use('/api', CartRouter);
app.use('/api', BillingRouter);
app.use('/api', orderRouter);
app.use('/api', EventTimeRouter);






app.listen(PORT,'0.0.0.0',   () =>{
    console.log(`server running on port ${PORT}`)
})


