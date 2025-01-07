import request from 'supertest';
import app from '../index';
import {faker} from "@faker-js/faker";
import {userFixture} from "./utils/fixtures/User";
import {registerAdmin} from "./utils/UserTestUtils";
import {clearDatabase} from "./utils/PrismaTestUtils";

beforeAll(async () => {
    await clearDatabase();
})

describe('AUTH API', () => {
    test('should register a new user', async () => {
        let password = faker.internet.password();

        const response = await request(app)
            .post('/users/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: faker.internet.email(),
                password: password,
                passwordConfirmation: password,
                name: faker.person.firstName(),
            });

        expect(response.status).toBe(200);
        expect(response.header['set-cookie'][1]).toMatch(/^access_token=/);
        expect(response.header['set-cookie'][0]).toMatch(/^refresh_token=/);
    });

    test('should not register a new user with different passwords', async () => {
        const response = await request(app)
            .post('/users/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: faker.internet.email(),
                password: faker.internet.password(),
                passwordConfirmation: faker.internet.password(),
                name: faker.person.firstName(),
            });

        expect(response.status).toBe(422);
    });

    test('should not register with non unique email', async () => {
        let user = await userFixture();
        let password = faker.internet.password();

        const response = await request(app)
            .post('/users/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: user.email,
                password: password,
                passwordConfirmation: password,
                name: faker.person.firstName(),
            });

        expect(response.status).toBe(409);
    });

    test('should login a user', async () => {
        let password = faker.internet.password();

        const userResponse = await request(app)
            .post('/users/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: faker.internet.email(),
                password: password,
                passwordConfirmation: password,
                name: faker.person.firstName(),
            });

        const response = await request(app)
            .post('/users/login')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: userResponse.body.email,
                password: password,
            });

        expect(response.status).toBe(200);
        expect(response.header['set-cookie'][1]).toMatch(/^access_token=/);
        expect(response.header['set-cookie'][0]).toMatch(/^refresh_token=/);
    });

    test('should not login a user with invalid credentials', async () => {
        const response = await request(app)
            .post('/users/login')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: faker.internet.email(),
                password: faker.internet.password(),
            });

        expect(response.status).toBe(401);
    });

    test('should refresh tokens', async () => {
        const admin = await registerAdmin();

        const response = await request(app)
            .post('/users/refresh')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', admin[1] + "; " + admin[2]);

        expect(response.status).toBe(200);
        expect(response.header['set-cookie'][1]).toMatch(/^access_token=/);
        expect(response.header['set-cookie'][0]).toMatch(/^refresh_token=/);
    })
})

describe('USER API', () => {
    test('should get list of users', async () => {
        let user1 = await userFixture();
        let user2 = await userFixture();


        const response = await request(app)
            .post('/users/list')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchParams: {
                    email: user1.email
                }
            })

        expect(response.body.map((user: any) => user.id)).toContain(user1.id);
        expect(response.body.length).toBe(1);
        expect(response.status).toBe(200);
    })

    test('should delete a user', async () => {
        let user = await userFixture();
        let admin = await registerAdmin();

        console.log(admin);

        const response = await request(app)
            .delete(`/users/${user.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', admin[1] + "; " + admin[2]);

        expect(response.status).toBe(200);
    })
})