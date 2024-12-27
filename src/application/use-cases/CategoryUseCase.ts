import {BaseUseCase} from "./BaseUseCase";
import {CategoryRepository} from "../../infrastructure/repositories/CategoryRepository";
import {processPrismaError} from "../../utils/Error";

export class CategoryUseCase extends BaseUseCase {
    private readonly CategoryRepository: CategoryRepository;

    constructor(categoryRepository: typeof CategoryRepository) {
        super();

        this.CategoryRepository = categoryRepository.create(this.prisma);
    }

    async createCategory(title: string) {
        try {
            return this.CategoryRepository.createCategory(title);
        } catch (e) {
            processPrismaError(e, 'Category');
        }
    }

    async findCategoryById(id: number) {
        try {
            return this.CategoryRepository.findCategoryById(id);
        } catch (e) {
            processPrismaError(e, 'Category');
        }
    }

    async deleteCategory(id: number) {
        return this.CategoryRepository.deleteCategory(id);
    }

    async updateCategory(id: number, title: string) {
        try {
            return this.CategoryRepository.updateCategory(id, title);
        } catch (e) {
            processPrismaError(e, 'Category');
        }
    }

    async listCategories() {
        return this.CategoryRepository.listCategories();
    }
}