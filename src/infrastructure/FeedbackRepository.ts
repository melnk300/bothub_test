import {BaseRepository} from "./BaseRepository";
import {Context} from "../utilities/Context";
import {ProcessingError} from "../utilities/Error";

export class FeedbackRepository extends BaseRepository {
    constructor() {
        super();
    }

    async findById(ctx: Context, id: number) {
        try {
            return await this.prisma.feedback.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "feedback"));
        }
    }

    async findByUserId(ctx: Context, userId: number) {
        try {
            return await this.prisma.feedback.findMany({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "feedback"));
        }
    }

    async create(ctx: Context, userId: number, title: string, description: string, categoryId: number) {
        try {
            return await this.prisma.feedback.create({
                data: {
                    userId: userId,
                    title: title,
                    description: description,
                    categoryId: categoryId
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "feedback"));
        }
    }

    async list(ctx: Context, filters?: any, orders?: any, offset: number = 0, limit: number = 25) {
        try {
            return await this.prisma.feedback.findMany({
                where: filters,
                skip: offset,
                take: limit,
                orderBy: orders
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "category"));
        }
    }

    async update(ctx: Context, id: number, title: string, description: string, categoryId: number, status: string) {
        try {
            return await this.prisma.feedback.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    description: description,
                    categoryId: categoryId,
                    status: status as any
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "feedback"));
        }
    }

    async delete(ctx: Context, id: number) {
        try {
            return await this.prisma.feedback.delete({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "feedback"));
        }
    }
}