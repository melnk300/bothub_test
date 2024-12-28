import {PrismaClient} from '@prisma/client';

export class UserRepository {
    private constructor(private readonly prisma: PrismaClient) {
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {email}
        });
    }

    async createUser(email: string, password: string, name: string) {
        return this.prisma.user.create({
            data: {email, password, name}
        });
    }

    async updateUser(id: number, email: string, password: string, name: string) {
        return this.prisma.user.update({
            where: {id},
            data: {email, password, name}
        });
    }

    async deleteUser(id: number) {
        return this.prisma.user.delete({
            where: {id}
        });
    }

    async changeAvatar(id: number, avatar: string) {
        return this.prisma.user.update({
            where: {id},
            data: {avatar}
        });
    }

    async listUsers() {
        return this.prisma.user.findMany();
    }

    static create(prisma: PrismaClient) {
        return new UserRepository(prisma);
    }
}