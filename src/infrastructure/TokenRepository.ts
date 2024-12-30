import {BaseRepository} from "./BaseRepository";
import {Context} from "../utilities/Context";
import {ProcessingError} from "../utilities/Error";

export class TokenRepository extends BaseRepository {
    constructor() {
        super();
    }

    async create(ctx: Context, userId: number, jti: string) {
        try {
            return await this.prisma.token.create({
                data: {
                    jti: jti,
                    userId: userId
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "token"));
        }
    }

    async delete(ctx: Context, jti: string) {
        try {
            return await this.prisma.token.delete({
                where: {
                    jti: jti
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "token"));
        }
    }

    async findByJti(ctx: Context, jti: string) {
        try {
            return await this.prisma.token.findUnique({
                where: {
                    jti: jti
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "token"));
        }
    }

    async findByUserId(ctx: Context, userId: number) {
        try {
            return await this.prisma.token.findMany({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            ctx.addError(ProcessingError.processPrismaError(error, "token"));
        }
    }
}