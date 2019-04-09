const mongoose = require('mongoose');
const Joi = require('joi');

const cuisineSchema = mongoose.Schema({
    dishName: { type: String, required: true },
    restaurantName: { type: String, required: true },
    cost: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true, maxLength: 255 },
    poster: { type: String, required: true }
})

validateCuisine = (cui) => {
    const schema = {
        dishName: Joi.string().min(3).max(50).required(),
        restaurantName: Joi.string().min(3).max(255).required(),
        type: Joi.string().min(3).max(1024).required(),
        cost: Joi.number().integer().required(),
        description: Joi.string().max(255).required(),
        poster: Joi.string().required(),
    };
    return Joi.validate(cui, schema);
}

const Cuisine = mongoose.model('Cuisine', cuisineSchema);
exports.Cuisine = Cuisine;
exports.validate = validateCuisine;