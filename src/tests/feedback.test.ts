import {clearDatabase} from "./utils/PrismaTestUtils";
import request from "supertest";
import app from "../index";
import {faker} from "@faker-js/faker";
import {feedbackFixture} from "./utils/fixtures/Feedback";
import {userFixture} from "./utils/fixtures/User";
import {categoryFixture} from "./utils/fixtures/Category";
import {registerAdmin, registerUser} from "./utils/UserTestUtils";

beforeAll(async () => {
    await clearDatabase();
})

describe('FEEDBACK API', () => {
    test('should create a new feedback', async () => {
        const category = await categoryFixture();
        const user = await registerUser();

        const response = await request(app)
            .post('/feedbacks')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', user[1] + "; " + user[2])
            .send({
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                categoryId: category.id
            });

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(user[0].id);
    })

    test('should list feedbacks', async () => {
        const user = await userFixture();
        const category = await categoryFixture();

        const feedback = await feedbackFixture(user.id, category.id);
        await feedbackFixture(user.id, category.id);

        const response = await request(app)
            .post('/feedbacks/list')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchParams: {
                    title: feedback.title,
                }
            });

        expect(response.body.map((c: any) => c.title)).toContain(feedback.title);
        expect(response.body.length).toBe(1);
        expect(response.status).toBe(200);
    })

    test('should fetch feedback by id', async () => {
        const user = await userFixture();
        const category = await categoryFixture();

        const feedback = await feedbackFixture(user.id, category.id);

        const response = await request(app)
            .get(`/feedbacks/${feedback.id}`);

        expect(response.body.title).toBe(feedback.title);
        expect(response.status).toBe(200);
    })

    test('should update feedback', async () => {
        const user = await registerUser();
        const category = await categoryFixture();
        const category2 = await categoryFixture();

        const feedback = await feedbackFixture(user[0].id, category.id);

        const response = await request(app)
            .put(`/feedbacks/${feedback.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', user[1] + "; " + user[2])
            .send({
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                categoryId: category2.id,
                status: "DONE"
            });

        expect(response.status).toBe(200);
        expect(response.body.categoryId).toBe(category2.id);
        expect(response.body.status).toBe("DONE");
    })

    test('should delete feedback', async () => {
        const user = await registerUser()
        const category = await categoryFixture();

        const feedback = await feedbackFixture(user[0].id, category.id);

        const response = await request(app)
            .delete(`/feedbacks/${feedback.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', user[1] + "; " + user[2]);

        expect(response.status).toBe(200);
    })
})