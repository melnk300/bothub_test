import {Prisma} from "@prisma/client";

export class ProcessingError extends Error {
    entity: string

    constructor(message: string, entity: string) {
        super(message);
        this.name = 'ProcessingError';
        this.entity = entity;
    }

    toJSON() {
        return {
            error: this.message,
            entity: this.entity
        }
    }
}

export function handleError(e: Error, res: any) {
    if (e instanceof ProcessingError) {
        switch (e.message) {
            case 'unique error':
                res.status(409).json(e.toJSON());
                break;
            case 'not found':
                res.status(404).json(e.toJSON());
                break;
            case 'passwords not match':
                res.status(400).json(e.toJSON());
                break;
            case 'forbidden':
                res.status(403).json(e.toJSON());
                break;
            default:
                res.status(422).json(e.toJSON());
        }
    } else {
        res.status(500).json({error: e.message});
    }
}

export function processPrismaError(e: any, entity: string) {
    console.log(e.code, e.message)

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
            throw new ProcessingError('unique error', entity); // Нарушение уникальности
        } else if (e.code === 'P2025') {
            throw new ProcessingError('not found', entity); // Объект не найден
        } else {
            throw new ProcessingError(`database error: ${e.message}`, entity); // Прочие ошибки Prisma
        }
    }

    if (e instanceof Prisma.PrismaClientValidationError) {
        throw new ProcessingError('invalid data', entity);
    }

    throw new ProcessingError(`unexpected error: ${e.message}`, entity);
}
