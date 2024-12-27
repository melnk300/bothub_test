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
        res.status(422).json({error: e.toJSON()});
    } else {
        res.status(500).json({error: e.message});
    }
}

export function processPrismaError(e: any, entity: string) {
    if (e.code === 'P2002') {
        throw new ProcessingError('unique error', entity);
    } else if (e.code === 'P2025') {
        throw new ProcessingError('not found', entity);
    } else {
        throw e;
    }
}