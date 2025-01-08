import express from "express";
import {VoteController} from "../controllers/VoteController";

const router = express.Router();

const voteController = new VoteController();

router.post('/list', voteController.listVotes.bind(voteController));
router.get('/:id', voteController.fetchVoteById.bind(voteController));
router.post('/', voteController.createVote.bind(voteController));
router.put('/:id', voteController.updateVote.bind(voteController));
router.delete('/:id', voteController.deleteVote.bind(voteController));

export default router;