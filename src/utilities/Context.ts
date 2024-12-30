import {ProcessingError} from "./Error";

export class Context {
    private readonly data: any;
    private readonly errors: Array<ProcessingError>;

    constructor() {
        this.data = {};
        this.errors = [];
    }

    public setData(data: string, value: any) {
        this.data[data] = value;
    }

    public getData(data: string) {
        return this.data[data];
    }

    public addError(error: ProcessingError) {
        this.errors.push(error);
    }

    public getErrors() {
        return this.errors;
    }
}