export type AddTodoCommand = { description: string };

export type TodoTO = { id: string; description: string; done: boolean };

export type ErrorResponse = {
    code: "todo_not_found" | "description_not_filled_in" | "description_too_long";
    errorMessage: string;
};

export class ApiError extends Error {
    constructor(public response: ErrorResponse) {
        super(response.errorMessage);
    }
}

export async function validateResponse(response: Response) {
    const result = await response.json();
    if (!response.ok) {
        throw new ApiError(result);
    }
    return result;
}
