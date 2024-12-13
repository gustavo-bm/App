const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute.js');
const accountRouter = require('./routes/accountRoute.js');
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);

mongoose.connect('mongodb+srv://gustavomoraes:senha123@cluster0.y0xgp.mongodb.net/')
.then(() => {
    console.log('Connected to database');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch((err) => {
    console.error(err);
});

