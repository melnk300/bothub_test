import request from 'supertest';
import app from '../index';
import {userFixture} from "./utils/fixtures/User";
import {faker} from "@faker-js/faker";
import {registerAdmin} from "./utils/UserTestUtils";
import {categoryFixture} from "./utils/fixtures/Category";
import {clearDatabase} from "./utils/PrismaTestUtils";

beforeAll(async () => {
    await clearDatabase();
})
describe('CATEGORY API', () => {
    test('should create a new category', async () => {
        const response = await request(app)
            .post('/categories')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                title: faker.commerce.productName(),
            });

        expect(response.status).toBe(201);
    })

    test('should not create a new category with empty title', async () => {
        const response = await request(app)
            .post('/categories')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                title: '',
            });

        expect(response.status).toBe(400);
    })

    test('should list categories', async () => {
        const category = await categoryFixture();
        await categoryFixture();

        const response = await request(app)
            .post('/categories/list')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchParams: {
                    title: category.title,
                }
            });

        expect(response.body.map((c: any) => c.title)).toContain(category.title);
        expect(response.body.length).toBe(1);
        expect(response.status).toBe(200);
    })

    test('should fetch category by id', async () => {
        const category = await categoryFixture();

        const response = await request(app)
            .get(`/categories/${category.id}`);

        expect(response.body.title).toBe(category.title);
        expect(response.status).toBe(200);
    })

    test('should update category', async () => {
        const category = await categoryFixture();
        const newTitle = faker.commerce.productName();

        const admin = await registerAdmin();

        const response = await request(app)
            .put(`/categories/${category.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', admin[1] + "; " + admin[2])
            .send({
                title: newTitle,
            });

        expect(response.body.title).toBe(newTitle);
        expect(response.status).toBe(200);
    })
})