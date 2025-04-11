const express = require("express")
const app = express();
const userRouter = require("./Router/userRouter");
const categoryRouter = require('./Router/categoryRouter');
const EventRouter = require('./Router/eventRouter');
const CartRouter = require ('./Router/cartRouter');
const BillingRouter = require('./Router/billingRouter');
const orderRouter = require('./Router/orderRouter')
const cors = require("cors");
const dbConnection = require('./config/config');
const dotenv = require("dotenv");
const PORT = process.env.PORT || 4001




app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'], // Allow frontend origins
    credentials: true, // Allow cookies or authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
  
  // Ensure OPTIONS requests are handled
  app.options('*', cors());
  





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






app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})


