import { Router } from 'express';
const transferController = require('../controllers/transferController.ts');

const transferRouter = Router();

transferRouter.get('/', transferController.getTransfers);
transferRouter.get('/:id', transferController.getTransfersFromAccount);
transferRouter.post('/:id_sender/:id_receiver', transferController.makeTransfer);

module.exports = transferRouter;