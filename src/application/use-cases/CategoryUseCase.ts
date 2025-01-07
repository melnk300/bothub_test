import {Context} from "../../utilities/Context";
import {CategoryRepository} from "../../infrastructure/CategoryRepository";
import {ProcessingError} from "../../utilities/Error";

export class CategoryUseCase {
    private repository: CategoryRepository;

    constructor(repository: CategoryRepository) {
        this.repository = repository;
    }

    async fetchCategoryById(ctx: Context, id: number) {
        let category = await this.repository.findById(ctx, id);
        if (ctx.getErrors().length > 0) {
            return;
        }

        if (!category) {
            ctx.addError(new ProcessingError("empty list", "category"));
            return;
        }

        return category;
    }

    async fetchCategoryByTitle(ctx: Context, title: string) {
        let category = await this.repository.findByTitle(ctx, title);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return category;
    }

    async createCategory(ctx: Context, title: string) {
        let category = await this.repository.create(ctx, title);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return category;
    }

    async updateCategory(ctx: Context, id: number, title: string) {
        let category = await this.repository.update(ctx, id, title);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return category;
    }

    async deleteCategory(ctx: Context, id: number) {
        let category = await this.repository.delete(ctx, id);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return category;
    }

    async fetchAllCategories(ctx: Context) {
        let categories = await this.repository.list(ctx);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return categories;
    }

    async fetchCategoriesList(ctx: Context, filters?: any, orders?: any, offset: number = 0, limit: number = 25) {
        let categories = await this.repository.list(ctx, filters, orders, offset, limit);
        if (ctx.getErrors().length > 0) {
            return;
        }

        if (!categories || categories.length === 0) {
            ctx.addError(new ProcessingError("empty list", "category"));
            return;
        }

        return categories;
    }


}