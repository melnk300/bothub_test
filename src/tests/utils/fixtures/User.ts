import {faker} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";

export function userFixture (role: "USER" | "ADMIN" = "USER") {
    let prisma = new PrismaClient();

    return prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: role
        }
    })
}