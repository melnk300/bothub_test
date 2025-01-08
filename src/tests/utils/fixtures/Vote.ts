import {faker} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";

export function voteFixture (userId: number, feedbackId: number) {
    let prisma = new PrismaClient();

    return prisma.vote.create({
        data: {
            userId: userId,
            feedbackId: feedbackId,
            value: faker.number.int(1) === 0 ? -1 : 1
        }
    })
}