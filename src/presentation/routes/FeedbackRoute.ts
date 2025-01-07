import express from "express";
import {FeedbackController} from "../controllers/FeedbackController";

const router = express.Router();

const feedbackController = new FeedbackController();

router.get('/:id', feedbackController.fetchFeedbackById.bind(feedbackController));
router.post('/list', feedbackController.listFeedbacks.bind(feedbackController));
router.post('/', feedbackController.createFeedback.bind(feedbackController));
router.put('/:id', feedbackController.updateFeedback.bind(feedbackController));
router.delete('/:id', feedbackController.deleteFeedback.bind(feedbackController));

export default router;