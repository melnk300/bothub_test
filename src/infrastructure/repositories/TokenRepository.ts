import {PrismaClient} from '@prisma/client';

export class TokenRepository {
    private constructor(private readonly prisma: PrismaClient) {}

    async findTokenByJti(jti: string) {
        return this.prisma.token.findUnique({
            where: {jti}
        });
    }

    async createToken(jti: string, userId: number) {
        return this.prisma.token.create({
            data: {jti, userId: userId}
        });
    }

    async deleteToken(jti: string) {
        return this.prisma.token.delete({
            where: {jti}
        });
    }

    static create(prisma: PrismaClient) {
        return new TokenRepository(prisma);
    }
}