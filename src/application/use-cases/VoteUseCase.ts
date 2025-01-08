import {VoteRepository} from "../../infrastructure/VoteRepository";
import {Context} from "../../utilities/Context";
import {ProcessingError} from "../../utilities/Error";

export class VoteUseCase {
    private repository: VoteRepository;

    constructor(repository: VoteRepository) {
        this.repository = repository;
    }

    async fetchVoteById(ctx: Context, id: number) {
        let vote = await this.repository.findById(ctx, id);
        if (ctx.getErrors().length > 0) {
            return;
        }

        if (!vote) {
            ctx.addError(new ProcessingError("empty list", "vote"));
            return;
        }

        return vote;
    }

    async fetchVoteByUser(ctx: Context, userId: number) {
        let vote = await this.repository.findByUser(ctx, userId);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return vote;
    }

    async fetchVoteByFeedback(ctx: Context, feedbackId: number) {
        let vote = await this.repository.findByFeedback(ctx, feedbackId);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return vote;
    }

    async fetchVoteByUserAndFeedback(ctx: Context, userId: number, feedbackId: number) {
        let vote = await this.repository.findByUserAndFeedback(ctx, userId, feedbackId);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return vote;
    }

    async createVote(ctx: Context, userId: number, feedbackId: number, value: number) {
        let vote = await this.repository.create(ctx, userId, feedbackId, value);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return vote;
    }

    async updateVote(ctx: Context, id: number, value: number) {
        let vote = await this.repository.update(ctx, id, value);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return vote;
    }

    async deleteVote(ctx: Context, id: number) {
        let vote = await this.repository.delete(ctx, id);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return vote;
    }

    async fetchVotesList(ctx: Context, filters?: any, orders?: any, limit: number = 25, offset: number = 0) {
        let votes = await this.repository.list(ctx, filters, orders, offset, limit);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return votes;
    }
}