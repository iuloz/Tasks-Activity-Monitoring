const { Sequelize, DataTypes } = require('sequelize');
const express = require("express");
const app = express();
const hostname = "localhost";
const port = 8000;
const HTTP_STATUS_BADREQ = 400;
const HTTP_STATUS_NOT_EXIST = 404;
const greetingMessage = { "message": "Hello World!" };
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db'
});

const userRoutes = require('./routes/userRoutes')
const phoneRoutes = require('./routes/phoneRoutes');
const User = require('./models/userModel');
const Phone = require('./models/phoneModel');

// Association between tables
User.hasMany(Phone);
Phone.belongsTo(User);

// Create table if not exists
(async () => {
    await sequelize.sync();
})();


app.use(express.json());
app.use(userRoutes);
app.use(phoneRoutes);


app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(HTTP_STATUS_BADREQ).json(greetingMessage);
})


app.use((req, res) => {	    // Any other request
    res.setHeader('Content-Type', 'application/json');
    res.status(HTTP_STATUS_NOT_EXIST).json({});
});


app.listen(port, () => {
    console.log(`Server is listening at http://${hostname}:${port}`)
});
