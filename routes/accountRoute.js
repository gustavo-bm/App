const express = require('express');
const accountRouter = express.Router();
const accountController = require('../controllers/accountController.js');

accountRouter.get('/', accountController.getAccounts);
accountRouter.get('/:id', accountController.getAccountById);
accountRouter.post('/', accountController.createAccount);
accountRouter.put('/:id', accountController.updateAccount);
accountRouter.delete('/:id', accountController.deleteAccount);

module.exports = accountRouter;