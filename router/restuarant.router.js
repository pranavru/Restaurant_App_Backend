const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Restaurant, validate } = require("../models/restaurant.model.js");
const auth = require('../middleware/auth.middleware.js');

router.use(express.json());

router.get('/',  async (req, res) => {
    const restaurantResult = await Restaurant.find();
    res.send(restaurantResult);
})

router.get('/:id', async (req, res) => {
    const restaurantResult = await Restaurant.findById({ _id: req.params.id })
    res.send(restaurantResult);
})

router.delete('/:id', async (req, res) => {
    const restaurantResult = await Restaurant.findByIdAndDelete({ _id: req.params.id })
    res.send(restaurantResult);
})

router.put('/:id', async (req, res) => {
    const restaurantResult = await Restaurant.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address,
            type: req.body.type,
            cuisines: req.body.cuisines
        }})
    res.send(restaurantResult);
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(404).send(error.details[0].message);

    const restaurant = await Restaurant.findOne({ name: req.body.name })
    if (restaurant) return res.status(400).send("Restaurant Already Exists!");

    let newRestaurant = new Restaurant(
        {
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address,
            type: req.body.type,
            cuisines: req.body.cuisines
        }
    )

    await newRestaurant.save();
    res.status(200).send(_.pick(newRestaurant, ['id', 'name', 'contact', 'address', 'type', "cuisines"]))
})

module.exports = router;