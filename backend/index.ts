const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const eventRouter = require('./routes/eventRoute');
const app = express();

// middleware
app.use(cors()); // without it is impossible to make interchanges with the frontend
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use('/api/events', eventRouter);

mongoose.connect('mongodb+srv://gustavomoraes:agenda123@agenda.qvcm5.mongodb.net/')
.then(() => {
    console.log('Connected to database');
    app.listen(3099, () => {
        console.log('Server is running on port 3099');
    });
})
.catch((error: unknown) => {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error('An error occurred');
    }
});