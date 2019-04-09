const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Order, validate } = require("../models/order.model.js");
const auth = require('../middleware/auth.middleware.js');

router.use(express.json());

// router.get('/me', async (req, res) => {
//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmZkODY1MTRiZmZhODUzOTY0YjdlMjUiLCJpYXQiOjE1NDMzNDE2NzF9.vZV3srGyXls39cHo2gLCr0aq688cN_7Xjk9tkrITqvs";
//     try {
//         const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
//         res.send(jwt.verify(token, config.get('jwtPrivateKey'))); 
//     } catch(e) {
//         res.send(e);
//     }
// })

router.get('/', async (req, res) => {
    const orderResult = await Order.find();
    res.send(orderResult);
})

router.get('/:id', async (req, res) => {
    const orderResult = await Order.findById({ _id: req.params.id })
    res.send(orderResult);
})

router.delete('/:id', async (req, res) => {
    const orderResult = await Order.findByIdAndDelete({ _id: req.params.id })
    res.send(orderResult);
})

router.put('/:id', async (req, res) => {
    const orderResult = await Order.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            token: req.body.token,
            orderId: req.body.orderId,
            date: req.body.date,
            cart: req.body.cart,
            total: req.body.total
        }
    })
    res.send(orderResult);
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(404).send(error.details[0].message);

    // const cart = await OrderfindOne({ dishName: req.body.dishName })
    // if (cart) return res.status(400).send("Cart Already Exists!");

    let newOrder = new Order(
        {
            token: req.body.token,
            orderId: req.body.orderId,
            cart: req.body.cart,
            total: req.body.total,
            date: req.body.date
        }
    )

    await newOrder.save();
    
    res.status(200).send(_.pick(newOrder, ['id', 'orderId', 'total', 'date', 'token']))
})

module.exports = router;