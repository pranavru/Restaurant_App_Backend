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
    response.send(_.pick(user, ["id", "username", "email", "contact"]));
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
    newUser.password =  await bcrypt.hash(newUser.password, salt);
    
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

router.put('/userPass/:id', async (request, response) => {
    
    const user = await User.findById(request.params.id);
    if(!await bcrypt.compare(request.body.password, user.password)) {
        console.log(!await bcrypt.compare(request.body.password, user.password));
        
        //Encrypt Password using Bcrypt
        const salt = await bcrypt.genSalt(10);
        request.body.password =  await bcrypt.hash(request.body.password, salt);

        const user_update = await User.findByIdAndUpdate({_id : request.params.id} , {
            
            $set: {
                username: request.body.username,
                email: request.body.email,
                password: request.body.password,
                contact: request.body.contact,
                cart: request.body.cart,
                userType: request.body.userType,
            }
        })        
        response.status(200)
        .send("Password successfully updated for user with username: " + user_update.username);
    } else {
        return response.status(400).send("You cannot enter last 3 Passwords");
    }
});

router.put('/userCart/:id', async (request, response) => {
    
    const user = await User.findById(request.params.id);
    const r = request.body;
    if(user.username == r.username && user.email == r.email && user.contact == r.contact && user.userType == r.userType ) {
        if(r.password == user.password) {
            const user_update = await User.findByIdAndUpdate({_id : request.params.id} , {
            
                $set: {
                    username: request.body.username,
                    email: request.body.email,
                    password: request.body.password,
                    contact: request.body.contact,
                    cart: request.body.cart,
                    userType: request.body.userType,
                }
            })        
            response.status(200)
            .send(_.pick(user_update, ["id", "username", "cart"]));
        }
    } else {
      response.send(400).send("Error - Cannot update cart");  
    }
});

module.exports = router;
