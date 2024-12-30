import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

const userController = new UserController();

router.get('/:id', userController.fetchUserById.bind(userController));
router.post('/', userController.listUsers.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.post('/register', userController.registerUser.bind(userController));

export default router;
