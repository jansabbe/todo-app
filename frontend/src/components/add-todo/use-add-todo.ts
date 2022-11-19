import { useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { validateResponse, AddTodoCommand, TodoTO, ApiError } from "../../lib/api";

export function useAddTodo(): UseMutationResult<TodoTO, ApiError, AddTodoCommand> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ description }: AddTodoCommand) =>
            fetch("/api/todos", {
                method: "POST",
                body: JSON.stringify({ description }),
                headers: { accept: "application/json", "content-type": "application/json" },
            }).then(validateResponse),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
}
