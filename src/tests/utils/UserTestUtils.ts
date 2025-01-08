import request from "supertest";
import app from "../../index";
import {faker} from "@faker-js/faker";
import {PrismaClient} from "@prisma/client";

export const registerAdmin = async () => {
    const prisma = new PrismaClient();
    const password = faker.internet.password();

    const response =  await request(app)
        .post('/users/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            email: `user_${Date.now()}@example.com`,
            password: password,
            passwordConfirmation: password,
            name: faker.person.firstName(),
        });

    await prisma.user.update({
        where: {
            email: response.body.email
        },
        data: {
            role: "ADMIN"
        }
    });


    return [response.body, response.header['set-cookie'][1], response.header['set-cookie'][0]];
}

export const registerUser = async () => {
    const password = faker.internet.password();

    const response = await request(app)
        .post('/users/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            email: `user_${Date.now()}@example.com`,
            password: password,
            passwordConfirmation: password,
            name: faker.person.firstName(),
        });

    return [response.body, response.header['set-cookie'][1], response.header['set-cookie'][0]];
}