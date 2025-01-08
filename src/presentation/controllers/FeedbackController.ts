import {AuthService} from "../../application/services/AuthService";
import {FeedbackUseCase} from "../../application/use-cases/FeedbackUseCase";
import {FeedbackRepository} from "../../infrastructure/FeedbackRepository";
import {UserRepository} from "../../infrastructure/UserRepository";
import {TokenRepository} from "../../infrastructure/TokenRepository";
import {Request, Response} from "express";
import {Context} from "../../utilities/Context";
import {validateParams} from "../../utilities/ParamsValidation";
import _ from "lodash";
import {ProcessingError} from "../../utilities/Error";
import {zh_CN} from "@faker-js/faker";
import {VoteUseCase} from "../../application/use-cases/VoteUseCase";
import {VoteRepository} from "../../infrastructure/VoteRepository";

export class FeedbackController {
    private feedbackUseCase: FeedbackUseCase;
    private feedbackRepo: FeedbackRepository;
    private authService: AuthService;
    private voteUseCase: VoteUseCase;

    constructor() {
        this.feedbackRepo = new FeedbackRepository();
        this.feedbackUseCase = new FeedbackUseCase(this.feedbackRepo);
        this.authService = new AuthService(new UserRepository(), new TokenRepository());
        this.voteUseCase = new VoteUseCase(new VoteRepository());
    }

    async fetchFeedbackById(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let feedback = await this.feedbackUseCase.fetchFeedbackById(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(feedback);
    }

    async listFeedbacks(req: Request, res: Response) {
        let ctx = new Context();

        let feedbacks = await this.feedbackUseCase.listFeedbacks(ctx,
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

        res.status(200).json(feedbacks);
    }

    async createFeedback(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.body, ["title", "description", "categoryId"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        const user = await this.authService.getUserFromToken(ctx, req.cookies.access_token);
        if (ctx.getErrors().length > 0) {
            res.status(401).json(ctx.getErrors());
            return;
        }

        let feedback = await this.feedbackUseCase.createFeedback(ctx,
            user!.id,
            validated.title,
            validated.description,
            Number(validated.categoryId)
        );

        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(201).json(feedback);
    }

    async updateFeedback(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        const user = await this.authService.getUserFromToken(ctx, req.cookies.access_token);

        let feedback = await this.feedbackUseCase.fetchFeedbackById(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        if (!(feedback!.userId === user!.id || user!.role === "ADMIN")) {
            ctx.addError(new ProcessingError("unauthorized", "feedback"));
            res.status(401).json(ctx.getErrors());
            return;
        }

        feedback = await this.feedbackUseCase.updateFeedback(ctx,
            Number(validated.id),
            req.body.title,
            req.body.description,
            req.body.categoryId,
            req.body.status
        );


        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(feedback);
    }

    async deleteFeedback(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        const user = await this.authService.getUserFromToken(ctx, req.cookies.access_token);

        let feedback = await this.feedbackUseCase.fetchFeedbackById(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        if (!(feedback!.userId === user!.id || user!.role === "ADMIN")) {
            ctx.addError(new ProcessingError("unauthorized", "feedback"));
            res.status(401).json(ctx.getErrors());
            return;
        }

        feedback = await this.feedbackUseCase.deleteFeedback(ctx, Number(validated.id));

        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(feedback);
    }

    async fetchUsersFeedbacks(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);

        let feedbacks = await this.feedbackUseCase.fetchFeedbackByUserId(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0]!.getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(feedbacks);
    }
}