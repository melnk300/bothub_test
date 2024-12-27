import {PrismaClient} from '@prisma/client';

export class CategoryRepository {
    private constructor(private readonly prisma: PrismaClient) {}

    async findCategoryById(id: number) {
        return this.prisma.category.findUnique({
            where: {id}
        });
    }

    async createCategory(title: string) {
        return this.prisma.category.create({
            data: {title}
        });
    }

    async deleteCategory(id: number) {
        return this.prisma.category.delete({
            where: {id}
        });
    }

    async updateCategory(id: number, title: string) {
        return this.prisma.category.update({
            where: {id},
            data: {title}
        });
    }

    async listCategories() {
        return this.prisma.category.findMany();
    }



    static create(prisma: PrismaClient) {
        return new CategoryRepository(prisma);
    }
}