import {Context} from "./Context";
import {ProcessingError} from "./Error";

export function validateParams(ctx: Context, params: any, required: string[], optional: string[] = []) {
    const validatedParams: any = {};

    for (const key of required) {
        if (!params[key]) {
            ctx.addError(ProcessingError.processCustomError(`missing ${key}`, "params"));
            return;
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