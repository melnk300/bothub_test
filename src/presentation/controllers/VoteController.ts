import {FeedbackRepository} from "../../infrastructure/FeedbackRepository";
import {VoteRepository} from "../../infrastructure/VoteRepository";
import {AuthService} from "../../application/services/AuthService";
import {TokenRepository} from "../../infrastructure/TokenRepository";
import {UserRepository} from "../../infrastructure/UserRepository";
import {Context} from "../../utilities/Context";
import {validateParams} from "../../utilities/ParamsValidation";
import {Request, Response} from "express";
import {VoteUseCase} from "../../application/use-cases/VoteUseCase";
import _ from "lodash";
import {ProcessingError} from "../../utilities/Error";

export class VoteController {
    private feedbackRepository: FeedbackRepository;
    private voteRepository: VoteRepository;
    private authService: AuthService;
    private voteUseCase: VoteUseCase;

    constructor() {
        this.voteRepository = new VoteRepository();
        this.feedbackRepository = new FeedbackRepository();
        this.voteUseCase = new VoteUseCase(this.voteRepository);
        this.authService = new AuthService(new UserRepository(), new TokenRepository());
    }

    async fetchVoteById(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(422).json(_.omit(ctx.getErrors()[0].getError(), ["status"]));
            return;
        }

        let vote = await this.voteUseCase.fetchVoteById(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(vote);
    }

    async fetchVoteByUserAndFeedback(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id", "feedbackId"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let vote = await this.voteUseCase.fetchVoteByUserAndFeedback(ctx, Number(validated.id), Number(validated.feedbackId));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(vote);
    }

    async createVote(req: Request, res: Response) {
        let ctx = new Context();

        let validated = {...validateParams(ctx, req.body, ["value", "feedbackId"])};
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        if (![1, -1].includes(validated.value)) {
            ctx.addError(new ProcessingError("invalid entity", "value"));
            res.status(400).json(ctx.getErrors());
            return;
        }

        let user = await this.authService.getUserFromToken(ctx, req.cookies.access_token);
        if (ctx.getErrors().length > 0) {
            res.status(401).json(ctx.getErrors());
            return;
        }

        let vote = await this.voteUseCase.createVote(ctx, user!.id, Number(validated.feedbackId), Number(validated.value));

        res.status(201).json(vote);
    }

    async updateVote(req: Request, res: Response) {
        let ctx = new Context();

        let validated = {...validateParams(ctx, req.body, ["value"]), ...validateParams(ctx, req.params, ["id"])};
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        if (![1, -1].includes(validated.value)) {
            ctx.addError(new ProcessingError("invalid entity", "value"));
            res.status(400).json(ctx.getErrors());
            return;
        }

        const user = await this.authService.getUserFromToken(ctx, req.cookies.access_token);
        if (ctx.getErrors().length > 0) {
            res.status(401).json(ctx.getErrors());
            return;
        }

        let vote = await this.voteUseCase.fetchVoteById(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        if (vote!.userId !== user!.id || user!.role !== "ADMIN") {
            ctx.addError(new ProcessingError("unauthorized", "vote"));
            res.status(401).json(ctx.getErrors());
            return;
        }

        vote = await this.voteUseCase.updateVote(ctx, Number(validated.id), Number(validated.value));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(vote);
    }

    async deleteVote(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let vote = await this.voteUseCase.deleteVote(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(vote);
    }

    async fetchVotesByFeedback(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let votes = await this.voteUseCase.fetchVoteByFeedback(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(votes);
    }

    async fetchVotesByUser(req: Request, res: Response) {
        let ctx = new Context();

        let validated = validateParams(ctx, req.params, ["id"]);
        if (ctx.getErrors().length > 0) {
            res.status(400).json(ctx.getErrors());
            return;
        }

        let votes = await this.voteUseCase.fetchVoteByUser(ctx, Number(validated.id));
        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0].getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(votes);
    }

    async listVotes(req: Request, res: Response) {
        let ctx = new Context();

        let votes = await this.voteUseCase.fetchVotesList(ctx,
            req.body.searchParams,
            req.body.orders,
            Number(req.query.limit || 25),
            Number(req.query.offset || 0),
        );

        if (ctx.getErrors().length > 0) {
            let error = ctx.getErrors()[0]!.getError()
            res.status(error.status).json(_.omit(error, ["status"]));
            return;
        }

        res.status(200).json(votes);
    }
}