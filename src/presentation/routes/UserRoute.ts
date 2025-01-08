import express from 'express';
import { UserController } from '../controllers/UserController';
import multer from "multer";
import path from "path";
import {FeedbackController} from "../controllers/FeedbackController";
import {VoteController} from "../controllers/VoteController";

const router = express.Router();

const userController = new UserController();
const feedbackController = new FeedbackController()
const voteController = new VoteController()

const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', userController.fetchUserById.bind(userController));
router.post('/list', userController.listUsers.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.post('/register', userController.registerUser.bind(userController));
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar.bind(userController));
router.post('/login', userController.login.bind(userController));
router.post('/refresh', userController.refreshTokens.bind(userController));
router.get('/:id/feedbacks', feedbackController.fetchUsersFeedbacks.bind(feedbackController));
router.get('/:id/feedbacks/:feedbackId/votes', voteController.fetchVoteByUserAndFeedback.bind(voteController));
router.get('/:id/votes', voteController.fetchVotesByUser.bind(voteController));


router.use('/avatars', express.static(path.join(process.env.STATIC_FILES_PATH!, 'uploads', 'avatars')));

export default router;
