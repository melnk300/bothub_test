import {BaseRepository} from "./BaseRepository";
import {Context} from "../utilities/Context";
import {ProcessingError} from "../utilities/Error";

export class UserRepository extends BaseRepository {
    constructor() {
        super();
    }

    async findById(ctx: Context, id: number) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "user"));
        }
    }

    async findByEmail(ctx: Context, email: string) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    email: email
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "user"));
        }
    }

    async create(ctx: Context, email: string, password: string, name: string) {
        try {
            return await this.prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: password
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "user"));
        }
    }

    async update(ctx: Context, id: number, email: string, password: string, name: string) {
        try {
            return await this.prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    name: name,
                    email: email,
                    password: password
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "user"));
        }
    }

    async delete(ctx: Context, id: number) {
        try {
            return await this.prisma.user.delete({
                where: {
                    id: id
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "user"));
        }
    }

    async list(ctx: Context, filters?: any, orders?: any, offset: number = 0, limit: number = 25) {
        try {
            return await this.prisma.user.findMany({
                where: filters,
                orderBy: orders,
                skip: offset,
                take: limit
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "user"));
        }
    }

    async updateAvatar(ctx: Context, id: number, avatar: string) {
        try {
            return await this.prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    avatar: avatar
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "user"));
        }
    }
}