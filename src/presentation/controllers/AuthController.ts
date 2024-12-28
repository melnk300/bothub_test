import {AuthUseCase} from "../../application/use-cases/AuthUseCase";
import {UserRepository} from "../../infrastructure/repositories/UserRepository";
import {TokenRepository} from "../../infrastructure/repositories/TokenRepository";
import {validateParams} from "../../utils/Validation";
import {Request, Response} from "express";
import {handleError} from "../../utils/Error";

export class AuthController {
    private authUseCase: AuthUseCase;

    constructor() {
        this.authUseCase = new AuthUseCase(TokenRepository, UserRepository);
    }

    register = async (req: Request, res: Response) => {
        try {
            const {name, email, password, password_confirmation, } = validateParams(req.body, ['name', 'email', 'password', 'password_confirmation']);

            let {user, tokens} = await this.authUseCase.register(name, email, password, password_confirmation, req.ip || '') as any;
            res.cookie('refresh_token', tokens.refresh_token, {httpOnly: true, sameSite: 'none', secure: true});
            res.cookie('access_token', tokens.access_token, {httpOnly: true, sameSite: 'none', secure: true});

            res.status(201).json({user});
        } catch (e: any) {
            handleError(e, res);
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const {email, password} = validateParams(req.body, ['email', 'password']);

            const {user, tokens} = await this.authUseCase.login(email, password, req.ip || '');
            res.cookie('refresh_token', tokens.refresh_token, {httpOnly: true, sameSite: 'none', secure: true});
            res.cookie('access_token', tokens.access_token, {httpOnly: true, sameSite: 'none', secure: true});

            res.status(200).json({user});
        } catch (e: any) {
            handleError(e, res);
        }
    };
}