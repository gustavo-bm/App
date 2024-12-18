import { Router } from 'express';
const eventController = require('../controllers/eventController.ts');

const eventRouter = Router(); 

eventRouter.get('/', eventController.getEvents);
eventRouter.get('/:id', eventController.getEventById);
eventRouter.post('/', eventController.createEvent);
eventRouter.put('/:id', eventController.updateEvent);
eventRouter.delete('/:id', eventController.deleteEvent);

module.exports = eventRouter;