import { Router } from 'express';
const accountController = require('../controllers/accountController.ts');

const accountRouter = Router();

accountRouter.get('/', accountController.getAccounts);
accountRouter.get('/:id', accountController.getAccountById);
accountRouter.post('/', accountController.createAccount);
accountRouter.put('/:id', accountController.updateAccount);
accountRouter.delete('/:id', accountController.deleteAccount);

module.exports = accountRouter;