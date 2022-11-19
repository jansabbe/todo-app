export type UseCase<C, R> = (command: C) => R;
export type TodoTO = { id: string; description: string; done: boolean };

export enum ErrorCode {
    TodoNotFound = "todo_not_found",
    DescriptionNotFilledIn = "description_not_filled_in",
    DescriptionTooLong = "description_too_long",
}

export type Maybe<T> =
    | { status: "OK"; result: T }
    | { status: "ERROR"; code: ErrorCode; errorMessage: string };

export const ok = <T>(result: T): Maybe<T> => ({ status: "OK", result });
export const error = (code: ErrorCode, errorMessage: string): Maybe<any> => ({
    status: "ERROR",
    code,
    errorMessage,
});
