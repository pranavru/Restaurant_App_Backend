const mongoose = require('mongoose');
const Joi = require('joi');

const cartSchema = mongoose.Schema({
    dishName: { type: String, required: true },
    restaurantName: { type: String, required: true },
    cost: { type: Number, required: true },
    type: { type: String, required: true },
    qty: { type: Number, required: true }
})

validateCart = (cart) => {
    const schema = {
        dishName: Joi.string().min(3).max(50).required(),
        restaurantName: Joi.string().min(3).max(255).required(),
        type: Joi.string().min(3).max(1024).required(),
        cost: Joi.number().integer().required(),
        qty: Joi.number().integer().required()
    };
    return Joi.validate(cart, schema);
}

const Cart = mongoose.model('Cart', cartSchema);
exports.Cart = Cart;
exports.validate = validateCart;