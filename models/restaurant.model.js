const mongoose = require('mongoose');
const Joi = require('joi');

const restaurantSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true, minLength: 5 },
    address: { type: String, required: true, minLength: 5, maxLength: 255 },
    contact: { type: Number, required: true, minLength: 10, maxLength: 10 },
    type: { type: String, required: true, minLength: 5, maxLength: 50 },
    cuisines: { type: Array}
})

validateRes = (res) => {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        address: Joi.string().min(3).max(255).required(),
        type: Joi.string().min(3).max(1024).required(),
        contact: Joi.number().integer().required(),
        cuisines: Joi.array()
    };
    return Joi.validate(res, schema);
}

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
exports.validate = validateRes;
exports.Restaurant = Restaurant;