const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = mongoose.Schema({
    orderId: { type: Number, required: true, unique: true },
    cart: { type: Array, required: true },
    date: { type: String, required: true, maxLength: 255 },
    total: { type: Number, required: true, minLength: 1, maxLength: 25 },
    token: { type: String, required: true }
})

validateOrder = (order) => {
    const schema = {

        total: Joi.number().integer().required(),
        cart: Joi.array().required(),
        date: Joi.string().min(10).max(255).required(),
        orderId: Joi.number().integer().required(),
        token: Joi.string().required()
    };
    return Joi.validate(order, schema);
}

const Order = mongoose.model('Order', orderSchema);
exports.Order = Order;
exports.validate = validateOrder;