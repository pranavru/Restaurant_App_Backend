const express = require("express");
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan')
const cors = require('cors');

const app = express();

const userRouter = require('../MongoResDatabase/router/user.router.js');
const authRouter = require('../MongoResDatabase/router/auth.router.js');
const restaurantRouter = require('../MongoResDatabase/router/restuarant.router.js');
const cuisineRouter = require('./router/cuisine.router.js');
const cartRouter = require('../MongoResDatabase/router/cart.router.js');
const orderRouter = require('../MongoResDatabase/router/order.router.js');


var mongoConnection = mongoose.connection;
mongoose.connect(config.get('dbConnectionString'))
mongoConnection.on("connected" , () => {
    console.log("Restaurant Database Connected to Port No 27017");
})
mongoConnection.on("error", (error) => {
    console.log(error);
})

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

app.use('/api/userRegister', userRouter);
app.use('/api/userLogin', authRouter);
app.use('/api/restuarants', restaurantRouter);
app.use('/api/cuisines', cuisineRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
    res.send("Welcome to Restaurant App");
}) 

const port = process.env.PORT || config.get('port');
app.listen(port, () => {
    console.log(`The server is connected on the Port ${port}`);
})