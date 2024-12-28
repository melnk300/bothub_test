import {BaseUseCase} from "./BaseUseCase";
import {TokenRepository} from "../../infrastructure/repositories/TokenRepository";
import {UserRepository} from "../../infrastructure/repositories/UserRepository";
import {AuthService} from "../services/AuthService";
import {ProcessingError, processPrismaError} from "../../utils/Error";

export class AuthUseCase extends BaseUseCase {
    private readonly TokenRepository: TokenRepository;
    private readonly UserRepository: UserRepository;

    constructor(tokenRepository: typeof TokenRepository, userRepository: typeof UserRepository) {
        super();

        this.TokenRepository = tokenRepository.create(this.prisma);
        this.UserRepository = userRepository.create(this.prisma);
    }

    async register(name: string, email: string, password: string, password_confirmation: string, ip_address: string) {
        if (password !== password_confirmation) {
            throw new ProcessingError('passwords not match', 'User');
        }

        const passwordHash = await AuthService.hashPassword(password);

        try {
            const user = await this.UserRepository.createUser(email, passwordHash, name);
            const tokens = AuthService.generateTokens(email, ip_address, user.id);

            await this.TokenRepository.createToken(tokens.jti, user.id);

            return {
                user: {
                    id: user.id,
                    email: email
                },
                tokens: tokens
            };
        } catch (e) {
            processPrismaError(e, 'User');
        }
    }

    async login(email: string, password: string, ip_address: string) {
        let user;

        try {
            user = await this.UserRepository.findUserByEmail(email);
        } catch (e) {
            processPrismaError(e, 'User');
        }

        if (!user) {
            throw new ProcessingError('not found', 'User');
        }

        const passwordMatch = await AuthService.verifyPassword(user!.password, password);

        if (!passwordMatch) {
            throw new ProcessingError('forbidden', 'User');
        }

        const tokens = AuthService.generateTokens(email, ip_address, user!.id);

        await this.TokenRepository.createToken(tokens.jti, user!.id);

        return {
            user: {
                id: user!.id,
                email: email
            },
            tokens: tokens
        };
    }
}