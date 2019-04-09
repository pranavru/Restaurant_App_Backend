const mongoose = require('mongoose');
const Joi = require('joi');
const {Cart} = require('../models/cart.model');

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true, minLength: 5, maxLength: 50 },
    email: { type: String, required: true, minLength: 5, maxLength: 255 },
    password: { type: String, required: true, minLength: 5, maxLength: 1024 },
    contact: { type: Number, required: true, minLength: 5, maxLength: 1024 }    
})

validateUser = (user) => {
    const schema = {
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
        contact: Joi.number().integer().required()
    }
    return Joi.validate(user, schema);
}

const User = mongoose.model("User", userSchema);
exports.validate = validateUser;
exports.User = User; 