const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true, minLength: 5, maxLength: 50 },
    email: { type: String, required: true, minLength: 5, maxLength: 255 },
    password: { type: String, required: true, minLength: 5, maxLength: 1024 },
    contact: { type: Number, required: true, minLength: 5, maxLength: 1024 },
    userType: { type: String, required: true},
    cart: { type: Object, required: false}
})

validateUser = (user) => {
    const schema = {
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
        contact: Joi.number().integer().required(),
        userType: Joi.string().required(),
        cart: Joi.object()
    }
    return Joi.validate(user, schema);
}

const User = mongoose.model("User", userSchema);
exports.validate = validateUser;
exports.User = User; 