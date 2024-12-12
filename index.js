const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/userModel.js');
const router = require('./routes/userRoute.js');
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use('/api/users', router);

mongoose.connect('mongodb://localhost:27017/')
.then(() => {
    console.log('Connected to database');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch((err) => {
    console.error(err);
});

