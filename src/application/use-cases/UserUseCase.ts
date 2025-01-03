import {Context} from "../../utilities/Context";
import {UserRepository} from "../../infrastructure/UserRepository";
import {ProcessingError} from "../../utilities/Error";

export class UserUseCase {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async fetchUserById(ctx: Context, id: number) {
        let user = await this.repository.findById(ctx, id);
        if (!user) {
            ctx.addError(new ProcessingError("empty list", "user"));
            return;
        }

        if (ctx.getErrors().length > 0) {
            return;
        }

        return user;
    }

    async fetchUserByEmail(ctx: Context, email: string) {
        let user = await this.repository.findByEmail(ctx, email);
        if (!user) {
            ctx.addError(new ProcessingError("empty list", "user"));
            return;
        }

        if (ctx.getErrors().length > 0) {
            return;
        }

        return user;
    }

    async createUser(ctx: Context, email: string, password: string, name: string) {
        let user = await this.repository.create(ctx, email, password, name);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return user;
    }

    async updateUser(ctx: Context, id: number, email: string, password: string, name: string) {
        let user = await this.repository.update(ctx, id, email, password, name);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return user;
    }

    async deleteUser(ctx: Context, id: number) {
        let user = await this.repository.delete(ctx, id);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return user;
    }

    async fetchUsersList(ctx: Context, filterParams: any, orderParams: any, limit?: number , offset?: number) {
        let users =  await this.repository.list(filterParams, orderParams, limit, offset);
        if (ctx.getErrors().length > 0) {
            return;
        }

        return users;
    }
}