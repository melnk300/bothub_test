import {faker} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";

export function feedbackFixture (userId: number, categoryId: number) {
    let prisma = new PrismaClient();

    return prisma.feedback.create({
        data: {
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            userId: userId,
            categoryId: categoryId
        }
    })
}