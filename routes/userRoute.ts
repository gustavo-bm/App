import { Router } from 'express';
const userController = require('../controllers/userController.ts');

const userRouter = Router(); 

userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.post('/', userController.createUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

module.exports = userRouter;