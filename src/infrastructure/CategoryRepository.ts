import {BaseRepository} from "./BaseRepository";
import {Context} from "../utilities/Context";
import {ProcessingError} from "../utilities/Error";

export class CategoryRepository extends BaseRepository {
    constructor() {
        super();
    }

    async findById(ctx: Context, id: number) {
        try {
            return await this.prisma.category.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "category"));
        }
    }

    async findByTitle(ctx: Context, title: string) {
        try {
            return await this.prisma.category.findUnique({
                where: {
                    title: title
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "category"));
        }
    }

    async create(ctx: Context, title: string) {
        try {
            return await this.prisma.category.create({
                data: {
                    title: title
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "category"));
        }
    }

    async update(ctx: Context, id: number, title: string) {
        try {
            return await this.prisma.category.update({
                where: {
                    id: id
                },
                data: {
                    title: title
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "category"));
        }
    }

    async delete(ctx: Context, id: number) {
        try {
            return await this.prisma.category.delete({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "category"));
        }
    }

    async list(ctx: Context, filters?: any, orders?: any, offset: number = 0, limit: number = 25) {
        try {
            return await this.prisma.category.findMany({
                where: filters,
                skip: offset,
                take: limit,
                orderBy: orders
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "category"));
        }
    }
}