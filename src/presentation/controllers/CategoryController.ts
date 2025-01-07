import {CategoryUseCase} from "../../application/use-cases/CategoryUseCase";
import {AuthService} from "../../application/services/AuthService";
import {CategoryRepository} from "../../infrastructure/CategoryRepository";
import {TokenRepository} from "../../infrastructure/TokenRepository";
import {UserRepository} from "../../infrastructure/UserRepository";
import {Context} from "../../utilities/Context";
import {validateParams} from "../../utilities/ParamsValidation";
import {Request, Response} from "express";
import _ from "lodash";

export class CategoryController {
    private categoryUseCase: CategoryUseCase;
    private categoryRepo: CategoryRepository;
    private authService: AuthService;

    constructor() {
        this.categoryRepo = new CategoryRepository();
        this.categoryUseCase = new CategoryUseCase(this.categoryRepo);
        this.authService = new AuthService(new UserRepository(), new TokenRepository());
    }

    async fetchCategoryById(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let category = await this.categoryUseCase.fetchCategoryById(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(category);
    }

    async listCategories(req: Request, res: Response) {
        let ctx = new Context();

        let categories = await this.categoryUseCase.fetchCategoriesList(ctx,
            req.body.searchParams,
            req.body.orders,
            Number(req.query.offset || 0),
            Number(req.query.limit || 25)
        );

        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0]!.getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(categories);
    }

    async deleteCategory(req: Request, res: Response) {
        let ctx = new Context();

        await this.authService.verifyRole(ctx, req.cookies.access_token, ["ADMIN"]);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let category = await this.categoryUseCase.deleteCategory(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(category);
    }

    async createCategory(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.body, ["title"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let category = await this.categoryUseCase.createCategory(ctx, validated.title);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(201).json(category);
    }

    async updateCategory(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.body, ["title"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let validatedParams = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let user = await this.authService.verifyRole(ctx, req.cookies.access_token, ["ADMIN"]);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        let category = await this.categoryUseCase.updateCategory(ctx,
            Number(validatedParams.id),
            validated.title);

        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(category);
    }
}