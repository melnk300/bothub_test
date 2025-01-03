import {Context} from "../../utilities/Context";
import {UserRepository} from "../../infrastructure/UserRepository";
import {TokenRepository} from "../../infrastructure/TokenRepository";
import * as argon2 from 'argon2';
import {ProcessingError} from "../../utilities/Error";
import {v4 as uuidv4} from 'uuid';
import jwt, {JwtPayload} from 'jsonwebtoken';

export class AuthService {
    private userRepository: UserRepository;
    private tokenRepository: TokenRepository;

    constructor(userRepository: UserRepository, tokenRepository: TokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    async generateTokens(ctx: Context, email: string, ipAddress: string, userId: number) {
        let jti = uuidv4();

        const data = {
            jti: jti,
            userId: userId,
            ipAddress: ipAddress,
            email: email
        };
        const signature = process.env.JWT_SECRET || 'secret';

        return {
            access_token: jwt.sign(data, signature, {expiresIn: '15m'}),
            refresh_token: jwt.sign(data, signature, {expiresIn: '7d'}),
            jti: jti
        }
    }

    async register (ctx: Context, email: string, password: string, name: string, ip_address: string) {
        let hashedPassword = await argon2.hash(password);
        let user = await this.userRepository.create(ctx, email, hashedPassword, name);
        if (ctx.getErrors().length > 0) {
            return;
        }

        let tokens = await this.generateTokens(ctx, email, ip_address, user!.id);
        await this.tokenRepository.create(ctx, user!.id, tokens.jti);

        return {
            user: user,
            tokens: tokens
        }
    }

    async login(ctx: Context, email: string, password: string, ip_address: string) {
        let user = await this.userRepository.findByEmail(ctx, email);
        if (ctx.getErrors().length > 0) {
            return;
        }

        if (!await argon2.verify(user!.password, password)) {
            ctx.addError(new ProcessingError("invalid credentials", "auth"));
            return;
        }

        let tokens = await this.generateTokens(ctx, email, ip_address, user!.id);
        await this.tokenRepository.create(ctx, user!.id, tokens.jti);

        return tokens;
    }

    async logout(ctx: Context, jti: string) {
        await this.tokenRepository.delete(ctx, jti);
    }

    async refreshTokens(ctx: Context, refreshToken: string, accessToken: string, ip_address: string) {
        let refPayload: JwtPayload
        let accPayload: JwtPayload

        try {
            refPayload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;
        } catch (error) {
            ctx.addError(new ProcessingError("invalid token", "auth"));
            return;
        }

        try {
            accPayload = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload;
        } catch (error) {
            ctx.addError(new ProcessingError("need refresh", "auth"));
            return;
        }


        if (refPayload.jti !== accPayload.jti) {
            ctx.addError(new ProcessingError("invalid token", "auth"));
            return;
        }

        let jti = await this.tokenRepository.findByJti(ctx, refPayload.jti as string);
        if (ctx.getErrors().length > 0) {
            ctx.addError(new ProcessingError("token was used", "auth"));
            return;
        }

        let user = await this.userRepository.findById(ctx, refPayload.userId as number);
        if (ctx.getErrors().length > 0) {
            return;
        }

        await this.tokenRepository.delete(ctx, refPayload.jti!);
        if (ctx.getErrors().length > 0) {
            return;
        }

        let tokens = await this.generateTokens(ctx, user!.email, ip_address, user!.id);
        await this.tokenRepository.create(ctx, user!.id, tokens.jti);

        return tokens;
    }

    async getUserFromToken(ctx: Context, token: string) {
        let payload: JwtPayload;

        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        } catch (error) {
            ctx.addError(new ProcessingError("invalid token", "auth"));
            return;
        }

        let user = await this.userRepository.findById(ctx, payload.userId as number);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return user;
    }

    async verifyRole(ctx: Context, token: string, role: string[]) {
        let payload: JwtPayload;

        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        } catch (error) {
            ctx.addError(new ProcessingError("invalid token", "auth"));
            return;
        }


        let user = await this.userRepository.findById(ctx, payload.userId as number);
        if (!user) {
            ctx.addError(new ProcessingError("invalid token", "auth"));
            return;
        }

        if (!role.includes(user!.role)) {
            ctx.addError(new ProcessingError("invalid role", "auth"));
            return;
        }

        return user;
    }
}