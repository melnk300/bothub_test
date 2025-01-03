import express from 'express';
import { UserController } from '../controllers/UserController';
import multer from "multer";
import path from "path";

const router = express.Router();

const userController = new UserController();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', userController.fetchUserById.bind(userController));
router.post('/', userController.listUsers.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.post('/register', userController.registerUser.bind(userController));
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar.bind(userController));

router.use('/avatars', express.static(path.join(process.env.STATIC_FILES_PATH!, 'uploads', 'avatars')));

export default router;
