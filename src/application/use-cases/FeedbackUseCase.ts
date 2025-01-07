import {FeedbackRepository} from "../../infrastructure/FeedbackRepository";
import {Context} from "../../utilities/Context";
import {ProcessingError} from "../../utilities/Error";

export  class FeedbackUseCase {
    private repository: FeedbackRepository;

    constructor(repository: FeedbackRepository) {
        this.repository = repository;
    }

    async fetchFeedbackById(ctx: Context, id: number) {
        let feedback = await this.repository.findById(ctx, id);
        if (ctx.getErrors().length > 0) {
            return;
        }

        if (!feedback) {
            ctx.addError(new ProcessingError("empty list", "feedback"));
            return;
        }

        return feedback;
    }

    async fetchFeedbackByUserId(ctx: Context, userId: number) {
        let feedback = await this.repository.findByUserId(ctx, userId);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return feedback;
    }

    async createFeedback(ctx: Context, userId: number, title: string, description: string, categoryId: number) {
        let feedback = await this.repository.create(ctx, userId, title, description, categoryId);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return feedback;
    }

    async listFeedbacks(ctx: Context, filters?: any, orders?: any, offset: number = 0, limit: number = 25) {
        let feedbacks = await this.repository.list(ctx, filters, orders, offset, limit);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return feedbacks;
    }

    async updateFeedback(ctx: Context, id: number, title?: string, description?: string, categoryId?: number, status?: string) {
        let feedback = await this.repository.findById(ctx, id);
        if (ctx.getErrors().length > 0) {
            return;
        }

        if (!feedback) {
            ctx.addError(new ProcessingError("empty list", "feedback"));
            return;
        }

        const newData = {
            title: title || feedback.title,
            description: description || feedback.description,
            categoryId: categoryId || feedback.categoryId,
            status: status || feedback.status
        }

        feedback = await this.repository.update(ctx, id, newData.title, newData.description, newData.categoryId, newData.status);

        return feedback;
    }

    async deleteFeedback(ctx: Context, number: number) {
        let feedback = await this.repository.delete(ctx, number);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return feedback;
    }
}