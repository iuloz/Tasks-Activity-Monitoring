const { Sequelize, Model, DataTypes, Op } = require('sequelize');
const express = require("express");
const app = express();
const hostname = "localhost";
const port = 8000;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_BADREQ = 400;  // NOK
const HTTP_STATUS_NOT_EXIST = 404;
const INTERNAL_SERVER_ERROR = 500;
const greetingMessage = {
    "message": "Hello World!",
};

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db'
});


class User extends Model { }
User.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    first: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: false
});


const Phone = sequelize.define('Phone', {
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'phones',
    timestamps: false
});

// Association between tables
User.hasMany(Phone);
Phone.belongsTo(User);

// Create table if not exists
(async () => {
    await sequelize.sync();
})();


app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(HTTP_STATUS_BADREQ).json(greetingMessage);
})

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Not found' });
        }
        res.status(HTTP_STATUS_OK).json(users);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/phones', async (req, res) => {
    try {
        const phones = await Phone.findAll();
        if (!phones) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Not found' });
        }
        res.status(HTTP_STATUS_OK).json(phones);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/users/search', async (req, res) => {
    const { op, include, ...conditions } = req.query;
    try {
        let whereConditions;
        if (op === 'and') {
            whereConditions = { [Op.and]: conditions };

        } else if (op === 'or') {
            whereConditions = { [Op.or]: conditions };

        } else if (op === 'gt') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));  // checks if value is number
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.gt]: parseFloat(conditions[key]) } }));  // array of objects

        } else if (op === 'lt') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.lt]: parseFloat(conditions[key]) } }));

        } else if (op === 'gte') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.gte]: parseFloat(conditions[key]) } }));

        } else if (op === 'lte') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.lte]: parseFloat(conditions[key]) } }));

        } else {
            whereConditions = conditions;
        }

        let includeModel = undefined;   // Table to be JOINed
        if (include) {  // check if model exists
            try {
                includeModel = sequelize.model(include);
            }
            catch {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'No Model with such name' });
            }
        }
        const users = await User.findAll({
            where: whereConditions,
            include: includeModel
        });
        if (!users) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Not found' });
        }
        res.status(HTTP_STATUS_OK).json(users);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/phones/search', async (req, res) => {
    const { op, include, ...conditions } = req.query;
    try {
        let whereConditions;
        if (op === 'and') {
            whereConditions = { [Op.and]: conditions };

        } else if (op === 'or') {
            whereConditions = { [Op.or]: conditions };

        } else if (op === 'gt') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.gt]: parseFloat(conditions[key]) } }));

        } else if (op === 'lt') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.lt]: parseFloat(conditions[key]) } }));

        } else if (op === 'gte') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.gte]: parseFloat(conditions[key]) } }));

        } else if (op === 'lte') {
            const isValid = Object.keys(conditions).every(key => !isNaN(parseFloat(conditions[key])));
            if (!isValid) {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'Cannot compare values of String data type' });
            }
            whereConditions = Object.keys(conditions).map(key => ({ [key]: { [Op.lte]: parseFloat(conditions[key]) } }));

        } else {
            whereConditions = conditions;
        }

        let includeModel = undefined;
        if (include) {
            try {
                includeModel = sequelize.model(include);
            }
            catch {
                return res.status(HTTP_STATUS_BADREQ).json({ error: 'No Model with such name' });
            }
        }
        const phones = await Phone.findAll({
            where: whereConditions,
            include: includeModel
        });
        if (!phones) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Not found' });
        }
        res.status(HTTP_STATUS_OK).json(phones);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'User not found' });
        }
        res.status(HTTP_STATUS_OK).json(user);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/phones/:id', async (req, res) => {
    try {
        const phone = await Phone.findByPk(req.params.id);
        if (!phone) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Not found' });
        }
        res.status(HTTP_STATUS_OK).json(phone);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});



app.post('/api/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(HTTP_STATUS_CREATED).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/phones', async (req, res) => {
    try {
        const newPhone = await Phone.create(req.body);
        res.status(HTTP_STATUS_CREATED).json(newPhone);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});

app.patch('/api/users/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'User not found' });
        }
        await user.update(updatedData);
        res.status(HTTP_STATUS_OK).json(user);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.patch('/api/phones/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const phone = await Phone.findByPk(req.params.id);
        if (!phone) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Phone not found' });
        }
        await phone.update(updatedData);
        res.status(HTTP_STATUS_OK).json(phone);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.put('/api/users/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'User not found' });
        }
        user.set(updatedData);
        await user.save();
        res.status(HTTP_STATUS_OK).json(user);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});


app.put('/api/phones/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const phone = await Phone.findByPk(req.params.id);
        if (!phone) {
            return res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Phone not found' });
        }
        phone.set(updatedData);
        await phone.save();
        res.status(HTTP_STATUS_OK).json(phone);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});



app.delete('/api/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: {
                id: req.params.id
            }
        });
        if (deletedUser === 0) {
            res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'User with this id does not exist' });
        } else {
            res.status(HTTP_STATUS_OK).json({ message: `User with id: ${req.params.id} deleted successfully` });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
});



app.delete('/api/phones/:id', async (req, res) => {
    try {
        const deletedPhone = await Phone.destroy({
            where: {
                id: req.params.id
            }
        });
        if (deletedPhone === 0) {
            res.status(HTTP_STATUS_NOT_EXIST).json({ error: 'Phone with this id does not exist' });
        } else {
            res.status(HTTP_STATUS_OK).json({ message: `Phone with id: ${req.params.id} deleted successfully` });
        }
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
    }
});



app.use((req, res) => {	    // Any other request
    res.setHeader('Content-Type', 'application/json');
    res.status(HTTP_STATUS_NOT_EXIST).json({ Error: "Not exist" });
});

app.listen(port, () => {
    console.log(`Server is listening at http://${hostname}:${port}`)
});