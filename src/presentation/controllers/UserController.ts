import {Context} from "../../utilities/Context";
import {UserRepository} from "../../infrastructure/UserRepository";
import {Request, Response} from "express";
import {validateParams} from "../../utilities/ParamsValidation";
import _ from "lodash";
import {UserUseCase} from "../../application/use-cases/UserUseCase";
import {AuthService} from "../../application/services/AuthService";
import {TokenRepository} from "../../infrastructure/TokenRepository";
import {FileService} from "../../application/services/FileService";
import {FeedbackRepository} from "../../infrastructure/FeedbackRepository";
import {FeedbackUseCase} from "../../application/use-cases/FeedbackUseCase";

export class UserController {
    private userUseCase: UserUseCase;
    private userRepo: UserRepository;
    private authService: AuthService;
    private fileService: FileService;
    private feedbackUseCase: FeedbackUseCase;

    constructor() {
        this.userRepo = new UserRepository();
        this.userUseCase = new UserUseCase(this.userRepo);
        this.authService = new AuthService(this.userRepo, new TokenRepository());
        this.fileService = new FileService();
        this.feedbackUseCase = new FeedbackUseCase(new FeedbackRepository());
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

        let users = await this.userUseCase.fetchUsersList(ctx,
            req.body.searchParams,
            req.body.orders,
            Number(req.query.limit || 25),
            Number(req.query.offset || 0));

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

        let validated = validateParams(ctx, req.body, ["email", "password", "passwordConfirmation", "name"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let user = await this.authService.register(ctx, validated.email, validated.password, validated.passwordConfirmation, validated.name, req.ip || "");
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.cookie("refresh_token", user!.tokens.refresh_token, {httpOnly: true});
        res.cookie("access_token", user!.tokens.access_token, {httpOnly: true});
        res.status(200).json(this.serializeUser(user!.user));
    }

    async uploadAvatar(req: Request, res: Response) {
        let ctx = new Context();

        if (!req.file) {
            res.status(400).json({error: "no file uploaded"});
            return;
        }

        let user = await this.authService.getUserFromToken(ctx, req.cookies.access_token);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        let avatar = await this.fileService.uploadAvatar(ctx, req.file);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        user = await this.userUseCase.uploadAvatar(ctx, user!.id, avatar!);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(this.serializeUser(user));
    }

    async refreshTokens(req: Request, res: Response) {
        let ctx = new Context();

        let tokens = await this.authService.refreshTokens(ctx, req.cookies.refresh_token, req.cookies.access_token, req.ip || "");
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.cookie("refresh_token", tokens!.refresh_token, {httpOnly: true});
        res.cookie("access_token", tokens!.access_token, {httpOnly: true});
        res.status(200).json({access_token: tokens!.access_token});
    }

    async login(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.body, ["email", "password"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let tokens = await this.authService.login(ctx, validated.email, validated.password, req.ip || "");
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        let user = await this.authService.getUserFromToken(ctx, tokens!.access_token);
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.cookie("refresh_token", tokens!.refresh_token, {httpOnly: true});
        res.cookie("access_token", tokens!.access_token, {httpOnly: true});
        res.status(200).json(this.serializeUser(user));
    }

    private serializeUser(user: any) {
        return _.omit(user, ["password"]);
    }
}