import request from 'supertest';
import app from '../index';
import {faker} from "@faker-js/faker";
import {userFixture} from "./utils/fixtures/User";
import {registerAdmin, registerUser} from "./utils/UserTestUtils";
import {clearDatabase} from "./utils/PrismaTestUtils";
import {feedbackFixture} from "./utils/fixtures/Feedback";
import {categoryFixture} from "./utils/fixtures/Category";
import {voteFixture} from "./utils/fixtures/Vote";
import {PrismaClient} from "@prisma/client";

let prisma = new PrismaClient();

describe('VOTE API', () => {
    test('should create a new vote', async () => {
        const admin = await registerAdmin();

        const feedback = await feedbackFixture(admin[0].id, (await categoryFixture()).id);
        const response = await request(app)
            .post(`/votes/`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', admin[1] + "; " + admin[2])
            .send({
                feedbackId: feedback.id,
                value: 1,
            });

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(admin[0].id);
    })

    test('should not create a new vote with invalid value', async () => {
        const admin = await registerAdmin();

        const feedback = await feedbackFixture(admin[0].id, (await categoryFixture()).id);
        const response = await request(app)
            .post(`/votes/`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', admin[1] + "; " + admin[2])
            .send({
                feedbackId: feedback.id,
                value: 2,
            });

        expect(response.status).toBe(400);
    })

    test('should get vote by id', async () => {
        const user = await userFixture();
        const feedback = await feedbackFixture(user.id, (await categoryFixture()).id);
        const vote = await voteFixture(user.id, feedback.id);

        const response = await request(app)
            .get(`/votes/${vote.id}`);

        expect(response.status).toBe(200);
        expect(response.body.userId).toBe(user.id);
    })

    test('should list votes', async () => {
        const user = await userFixture();
        const user2 = await userFixture();
        const feedback = await feedbackFixture(user.id, (await categoryFixture()).id);
        await voteFixture(user.id, feedback.id);
        await voteFixture(user.id, feedback.id);
        await voteFixture(user2.id, feedback.id);


        const response = await request(app)
            .post('/votes/list')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchParams: {
                    userId: user.id,
                }
            });

        expect(response.body.length).toBe(2);
        expect(response.status).toBe(200);
        expect(response.body.map((v: any) => v.userId)).toEqual(expect.arrayContaining([user.id, user.id]));
    })

    test('should update vote', async () => {
        const user = await registerAdmin();
        const feedback = await feedbackFixture(user[0].id, (await categoryFixture()).id);
        const vote = await voteFixture(user[0].id, feedback.id);

        const response = await request(app)
            .put(`/votes/${vote.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', user[1] + "; " + user[2])
            .send({
                value: -1,
            });

        expect(response.status).toBe(200);
        expect(response.body.value).toBe(-1);
    })

    test('should delete vote', async () => {
        const user = await registerAdmin();
        const feedback = await feedbackFixture(user[0].id, (await categoryFixture()).id);
        const vote = await voteFixture(user[0].id, feedback.id);

        const response = await request(app)
            .delete(`/votes/${vote.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', user[1] + "; " + user[2]);

        expect(response.status).toBe(200);
    })
})