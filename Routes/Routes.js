const express = require('express');
const MiddleWare = require('../middleware/authorization');
const Router = express.Router();
const AuthController = require('../Controllers/AuthController');
const ProtectedController = require('../Controllers/ProtectedController');
const TransactionService = require('../Controllers/TransactionController');
//Get All Users
Router.get('/users', AuthController.getUsers);

//Register an user
Router.post('/register', AuthController.addUser);

//Login user
Router.post('/Login',AuthController.login);

//Protected route
Router.get('/Dashboard/:userid', MiddleWare.checkAuthenticity,  ProtectedController.dashboard);

//Authentication Using DB Transactions 
Router.post('/Transaction/Register', TransactionService.Registration);
Router.post('/Transaction/Login', TransactionService.Login);
module.exports = Router;