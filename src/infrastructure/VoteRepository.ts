import {ProcessingError} from "../utilities/Error";
import {Context} from "../utilities/Context";
import {BaseRepository} from "./BaseRepository";

export class VoteRepository extends BaseRepository {
    constructor() {
        super();
    }

    async findById(ctx: Context, id: number) {
        try {
            return await this.prisma.vote.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }

    async findByUserAndFeedback(ctx: Context, userId: number, feedbackId: number) {
        try {
            return await this.prisma.vote.findMany({
                where: {
                    userId: userId,
                    feedbackId: feedbackId
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }

    async create(ctx: Context, userId: number, feedbackId: number, value: number) {
        try {
            return await this.prisma.vote.create({
                data: {
                    userId: userId,
                    feedbackId: feedbackId,
                    value: value
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }

    async update(ctx: Context, id: number, value: number) {
        try {
            return await this.prisma.vote.update({
                where: {
                    id: id
                },
                data: {
                    value: value
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }

    async delete(ctx: Context, id: number) {
        try {
            return await this.prisma.vote.delete({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }

    async findByFeedback(ctx: Context, feedbackId: number) {
        try {
            return await this.prisma.vote.findMany({
                where: {
                    feedbackId: feedbackId
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }

    async findByUser(ctx: Context, userId: number) {
        try {
            return await this.prisma.vote.findMany({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }

    async list(ctx: Context, filters?: any, orders?: any, offset: number = 0, limit: number = 25) {
        try {
            return await this.prisma.vote.findMany({
                where: filters,
                orderBy: orders,
                skip: offset,
                take: limit
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "vote"));
        }
    }
}