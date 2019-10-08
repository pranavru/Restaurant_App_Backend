const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const _ = require('lodash');

const { User, validate } = require('../models/user.model.js');

router.use(express.json());

router.get('/', async (request, response) => {
    const user = await User.find();
    response.send(user);
});

router.get('/:username', async (request, response) => {
    const user = await User.findOne({ username: request.params.username});
    response.send(_.pick(user, ["username", "email", "contact"]));
});

router.post('/', async (request, response) => {

    //Check the Error
    const { error } = validate(request.body);
    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    if(await User.findOne({ username: request.body.username })) {
        return response.status(400).send("Username is Invalid");
    } else if(await User.findOne({ email: request.body.email }) ) {
        return response.status(400).send("User already exists in the Database");
    } else if(await User.findOne({contact: request.body.contact})) {
        return response.status(400).send("User already exists in the Database");
    }

    let newUser = new User({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        contact: request.body.contact,
        cart: request.body.cart,
        userType: request.body.userType,
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
