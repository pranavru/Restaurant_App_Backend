const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const _ = require('lodash');

const { User, validate } = require('../models/user.model.js');

router.use(express.json());

router.get('/', (request, response) => {
    response.send("USER DATABASE REST API");
})

router.post('/', async (request, response) => {

    //Check the Error
    const { error } = validate(request.body);
    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    let newUser = new User({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        contact: request.body.contact,
        cart: request.body.cart,
        userType: request.body.userType
    })


    //Encrypt Password using Bcrypt
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    
    await newUser.save()
    const token =
        jwt.sign(
            {
                username: request.body.username,
                email: request.body.email
            }, config.get('jwtPrivateKey')
        );

    response
        .header('x-auth-token', token)
        .status(200).send(_.pick(newUser, ['id', 'username']));
})

module.exports = router;
