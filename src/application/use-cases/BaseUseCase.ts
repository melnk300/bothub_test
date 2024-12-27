import {PrismaClient} from "@prisma/client";

export class BaseUseCase {
    protected prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
}