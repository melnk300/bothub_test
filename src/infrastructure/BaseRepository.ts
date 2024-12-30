import { PrismaClient } from "@prisma/client";

export class BaseRepository {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
}