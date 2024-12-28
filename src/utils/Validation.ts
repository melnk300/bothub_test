import {ProcessingError} from "./Error";

export function validateParams(params: any, required: string[], optional: string[] = []) {
    const validatedParams: any = {};

    for (const key of required) {
        if (!params[key]) {
            throw new ProcessingError(`required param ${key} is missing`, 'Validation');
        }
        validatedParams[key] = params[key];
    }

    for (const key of optional) {
        if (params[key]) {
            validatedParams[key] = params[key];
        }
    }

    return validatedParams;
}