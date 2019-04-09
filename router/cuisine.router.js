const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Cuisine, validate } = require("../models/cuisine.model.js");
const auth = require('../middleware/auth.middleware.js');

router.use(express.json());

router.get('/', async (req, res) => {
    const cuisineResult = await Cuisine.find();
    res.send(cuisineResult);
})

router.get('/:id', async (req, res) => {
    const cuisineResult = await Cuisine.findById({ _id: req.params.id })
    res.send(cuisineResult);
})

router.delete('/:id', async (req, res) => {
    const cuisineResult = await Cuisine.findByIdAndDelete({ _id: req.params.id })
    res.send(cuisineResult);
})

router.put('/:id', async (req, res) => {
    const cuisineResult = await Cuisine.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            dishName: req.body.dishName,
            restaurantName: req.body.restaurantName,
            cost : req.body.cost,
            type: req.body.type,
            description: req.body.description,
            poster: req.body.poster
        }})
    res.send(cuisineResult);
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(404).send(error.details[0].message);

    const cuisine = await Cuisine.findOne({ dishName: req.body.dishName })
    if (cuisine) return res.status(400).send("Cuisine Already Exists!");

    let newCuisine = new Cuisine(
        {
            dishName: req.body.dishName,
            restaurantName: req.body.restaurantName,
            cost : req.body.cost,
            type: req.body.type,
            description: req.body.description,
            poster: req.body.poster
        }
    )

    await newCuisine.save();
    res.status(200).send(_.pick(newCuisine, ['id', 'dishName', 'restaurantName', 'cost', 'description', 'poster']))
})

module.exports = router;