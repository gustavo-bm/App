import { Router } from 'express';
const transferController = require('../controllers/transferController.ts');

const transferRouter = Router();

transferRouter.get('/', transferController.getTransfers);
transferRouter.get('/:id', transferController.getTransfersFromAccount);

module.exports = transferRouter;