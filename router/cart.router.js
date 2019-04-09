const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Cart, validate } = require("../models/cart.model.js");
const auth = require('../middleware/auth.middleware.js');

router.use(express.json());

router.get('/', async (req, res) => {
    const cartResult = await Cart.find();
    res.send(cartResult);
})

router.get('/:id', async (req, res) => {
    const cartResult = await Cart.findById({ _id: req.params.id })
    res.send(cartResult);
})

router.delete('/:id', async (req, res) => {
    const cartResult = await Cart.deleteMany({ _id: req.params.id })
    res.send(cartResult);
})

router.put('/:id', async (req, res) => {
    const cartResult = await Cart.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address,
            type: req.body.type,
            qty : req.body.qty
        }
    })
    res.send(cartResult);
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(404).send(error.details[0].message);

    const cart = await Cart.findOne({ dishName: req.body.dishName })
    if (cart) {
        let quantity = cart.qty
        console.log(cart)
        quantity += 1;
        const cartResult = await Cart.findByIdAndUpdate({ _id: cart.id }, {
            $set: {
                name: req.body.name,
                contact: req.body.contact,
                address: req.body.address,
                type: req.body.type,
                qty: quantity
            }
        })
        res.send(cartResult);

    } else {
        let newCart = new Cart(
            {
                dishName: req.body.dishName,
                restaurantName: req.body.restaurantName,
                cost: req.body.cost,
                type: req.body.type,
                qty: req.body.qty
            }
        )

        await newCart.save();
        res.status(200).send(_.pick(newCart, ['id', 'dishName', 'restaurantName', 'cost', 'type']))
    }
})

module.exports = router;