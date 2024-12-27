import {CategoryUseCase} from "../../application/use-cases/CategoryUseCase";
import {CategoryRepository} from "../../infrastructure/repositories/CategoryRepository";
import {Request, Response} from "express";
import {handleError} from "../../utils/Error";

export class CategoryController {
    private categoryUseCase: CategoryUseCase;

    constructor() {
        this.categoryUseCase = new CategoryUseCase(CategoryRepository);
    }

    createCategory = async (req: Request, res: Response) => {
        const {title} = req.body;

        try {
            const category = await this.categoryUseCase.createCategory(title);
            res.status(201).json(category);
        } catch (e: any) {
            handleError(e, res);
        }
    };

    findCategoryById = async (req: Request, res: Response) => {
        const {id} = req.params;

        try {
            const category = await this.categoryUseCase.findCategoryById(Number(id));
            res.status(200).json(category);
        } catch (e: any) {
            handleError(e, res);
        }
    };

    deleteCategory = async (req: Request, res: Response) => {
        const {id} = req.params;

        try {
            await this.categoryUseCase.deleteCategory(Number(id));
            res.status(204).send();
        } catch (e: any) {
            handleError(e, res);
        }
    };

    updateCategory = async (req: Request, res: Response) => {
        const {id} = req.params;
        const {title} = req.body;

        try {
            const category = await this.categoryUseCase.updateCategory(Number(id), title);
            res.status(200).json(category);
        } catch (e: any) {
            handleError(e, res);
        }
    };

    listCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryUseCase.listCategories();
            res.status(200).json(categories);
        } catch (e: any) {
            handleError(e, res);
        }
    };
}