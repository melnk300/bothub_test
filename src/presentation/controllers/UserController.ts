import {Context} from "../../utilities/Context";
import {UserRepository} from "../../infrastructure/UserRepository";
import {Request, Response} from "express";
import {validateParams} from "../../utilities/ParamsValidation";
import _ from "lodash";
import {UserUseCase} from "../../application/use-cases/UserUseCase";
import {AuthService} from "../../application/services/AuthService";
import {TokenRepository} from "../../infrastructure/TokenRepository";

export class UserController {
    private userUseCase: UserUseCase;
    private userRepo: UserRepository;
    private authService: AuthService;

    constructor() {
        this.userRepo = new UserRepository();
        this.userUseCase = new UserUseCase(this.userRepo);
        this.authService = new AuthService(this.userRepo, new TokenRepository());
    }

    async fetchUserById(req: Request, res: Response) {
        let ctx = new Context();
        
        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let user = await this.userUseCase.fetchUserById(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(this.serializeUser(user));
    }

    async listUsers(req: Request, res: Response) {
        let ctx = new Context();

        let users = await this.userUseCase.fetchUsersList(ctx, req.body.searchParams, req.body.oreders, Number(req.query.limit), Number(req.query.offset));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0]!.getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(users?.map(this.serializeUser));
    }

    async deleteUser(req: Request, res: Response) {
        let ctx = new Context();

        await this.authService.verifyRole(ctx, req.cookies.access_token, ["ADMIN"]);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        let user = await this.userUseCase.deleteUser(ctx, Number(req.params.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(this.serializeUser(user));
    }

    async registerUser(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.body, ["email", "password", "name"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let user = await this.authService.register(ctx, validated.email, validated.password, validated.name, req.ip || "");
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.cookie("refresh_token", user!.tokens.refresh_token, {httpOnly: true});
        res.cookie("access_token", user!.tokens.access_token, {httpOnly: true});
        res.status(200).json(this.serializeUser(user!.user));
    }

    private serializeUser(user: any) {
        return _.omit(user, ["password"]);
    }
}