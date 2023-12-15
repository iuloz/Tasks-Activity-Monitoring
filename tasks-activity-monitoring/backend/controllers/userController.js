const User = require('../models/userModel');
const Phone = require('../models/phoneModel');
const { Op } = require('sequelize');
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_BADREQ = 400;
const HTTP_STATUS_NOT_EXIST = 404;
const INTERNAL_SERVER_ERROR = 500;



async function getAllUsers(req, res) {
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
}


async function findUsers(req, res) {
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
        if (include.toLowerCase() === 'phone') {  // check if model exists
            try {
                includeModel = Phone;
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
}


async function getUserById(req, res) {
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
}


async function createUser(req, res) {
    try {
        const newUser = await User.create(req.body);
        res.status(HTTP_STATUS_CREATED).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}


async function patchUser(req, res) {
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
}


async function putUser(req, res) {
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
}


async function deleteUser(req, res) {
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
}


module.exports = {
    getAllUsers,
    findUsers,
    getUserById,
    createUser,
    patchUser,
    putUser,
    deleteUser
};