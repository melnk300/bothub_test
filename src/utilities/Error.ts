export class ProcessingError extends Error {
    private entity: string;

    constructor(message: string, entity: string) {
        super(message);
        this.name = "ProcessingError";
        this.entity = entity;

        console.log(`ProcessingError: ${message} - ${entity}`);
    }

    static processPrismaError(error: any, entity: string) {
        console.log(error);
        if (error.code === "P2025") {
            return new ProcessingError("not found", entity);
        } else if (error.code === "P2002") {
            return new ProcessingError("unique error", entity);
        } else {
            return new ProcessingError("unknown error", entity);
        }
    }

    static processCustomError(message: string, entity: string) {
        return new ProcessingError(message, entity);
    }

    public getError() {
        let status = 500;
        if (this.message === "not found") {
            status = 404;
        } else if (this.message === "unique error") {
            status = 409;
        } else if (this.message === "unknown error") {
            status = 422;
        } else if (this.message === "invalid role") {
            status = 403;
        } else if (this.message === "unauthorized") {
            status = 401;
        } else if (this.message === "empty list") {
            status = 200;
        }

        return {
            message: this.message,
            entity: this.entity,
            status: status
        };
    }
}

