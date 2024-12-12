const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);