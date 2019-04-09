const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const { User } = require('../models/user.model.js');

router.post('/', async (request, response) => {
    //Check for Validation Error
    const { error } = validate(request.body);
    if (error)
        return response.status(400).send(error.details[0].message);

    //Check user Exist
    const user = await User.findOne({ username: request.body.username })
    if (!user)
        return response.status(400).send("Invalid Username & Password");

    const validPassword = await bcrypt.compare(request.body.password, user.password);
    if (!validPassword)
        return response.status(400).send("Invalid Email and Password");

    const token =
        jwt.sign(
            {
                _id: user._id,
                username: user.username
            }, config.get('jwtPrivateKey')
        );
    response.status(200).json({ success: true, token: token });
})

validate = (user) => {
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

module.exports = router;