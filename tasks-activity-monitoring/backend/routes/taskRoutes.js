const { Router } = require('express');
const app = Router();
const { getAllUsers, findUsers, getUserById, createUser, patchUser, putUser, deleteUser } = require('../controllers/userController');


app.get('/tasks', getAllUsers);
app.get('/tasks/search', findUsers);
app.get('/api/users/:id', getUserById);
app.post('/api/users', createUser);
app.patch('/api/users/:id', patchUser);
app.put('/api/users/:id', putUser);
app.delete('/api/users/:id', deleteUser);


module.exports = app;