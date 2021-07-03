const express = require('express');

const Router = express.Router();
const AuthController = require('../Controllers/AuthController');
//Get All Users
Router.get('/users', AuthController.getUsers);

//Register an user
Router.post('/register', AuthController.addUser);




module.exports = Router;