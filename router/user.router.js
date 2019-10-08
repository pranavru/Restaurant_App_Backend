const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const _ = require('lodash');

const { User, validate } = require('../models/user.model.js');

router.use(express.json());

//Gets all the Users required
router.get('/', async (request, response) => {
    const user = await User.find();
    response.send(user);
});

//Gets the User matching with the required id 
router.get('/username/:username', async (request, response) => {
    const user = await User.findOne({ username: request.params.username });
    response.send(_.pick(user, ["id", "username", "email", "contact"]));
});

//Gets the User matching with the required id 
router.get('/email/:email', async (request, response) => {
    const user = await User.findOne({ email: request.params.email });
    response.send(_.pick(user, ["id", "username", "email", "contact"]));
});

//Allows the User to Sign Up themselves in the Database
router.post('/', async (request, response) => {

    //Check the Error
    const { error } = validate(request.body);
    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    if (await User.findOne({ username: request.body.username })) {
        return response.status(400).send("Username is Invalid");
    } else if (await User.findOne({ email: request.body.email })) {
        return response.status(400).send("User already exists in the Database");
    } else if (await User.findOne({ contact: request.body.contact })) {
        return response.status(400).send("User already exists in the Database");
    }

    let newUser = new User({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        contact: request.body.contact,
        cart: request.body.cart,
        userType: request.body.userType,
        orders: request.body.orders
    })


    //Encrypt Password using Bcrypt
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

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

//Change User Password
router.put('/userPassword/:id', async (request, response) => {
    const user = await User.findById(request.params.id);
    //Compare the Old and new Pasword
    if (!await bcrypt.compare(request.body.password, user.password)) {
        //Encrypt Password using Bcrypt
        const salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);

        updateValues("password", request.body.password, user, response);
    } else {
        return response.status(400).send("You cannot enter last 3 Passwords");
    }
});

router.put('/userContact/:id', async (request, response) => {
    const user = await User.findById(request.params.id);
    updateValues("contact", request.body.contact, user, response);
});

updateValues = async (key, value, user, response) => {
    let user_object = user;
    console.log(user + '\n');
    if (key == "password") {
        user_object.password = value;
        console.log(user + '\n');
        user_update = await User.findOneAndUpdate({ _id: user_object.id }, {
            $set: user_object
        })
        response.status(200).send("Password successfully updated for user");
    } else if (key == "contact") {
        user_object.contact = value
        user_update = await User.findOneAndUpdate({ _id: user_object.id }, {
            $set: user_object
        })
        response.status(200).send("Password successfully updated for user");
    } else {
        response.status(400).send("Something went Wrong - Cannot Update User Details");
    }
}

getUser = () => {

}
module.exports = router;