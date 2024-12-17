const mongoose = require('mongoose');

// creates a schema, basically an Interface to control models
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"]
        },
        age: {
            type: Number,
            required: true,
        },
        savings: {
            type: Number,
            required: true,
            default: 0
        },
        photo: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true // shows creation/update moments on time
    }
);

// _id is added automatically, but you can overwrite it. { _id: false } disables the id
module.exports = mongoose.model('User', userSchema); // necessary to use it elsewhere