import {faker} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";

export function categoryFixture () {
    let prisma = new PrismaClient();

    return prisma.category.create({
        data: {
            title: faker.commerce.productName(),
        }
    })
}