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
}