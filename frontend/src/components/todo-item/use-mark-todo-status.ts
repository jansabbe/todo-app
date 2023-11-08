import { useQueryClient, useMutation, UseMutationResult } from "@tanstack/react-query";
import { ApiError, TodoTO, validateResponse } from "../../lib/api";

type Args = { id: string };
type Result = UseMutationResult<void, ApiError, { done: boolean }>;

export function useMarkTodoStatus({ id }: Args): Result {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { done: boolean }) =>
            fetch(`/api/todos/${encodeURIComponent(id)}/status`, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: { accept: "application/json", "content-type": "application/json" },
            }).then(validateResponse),
        onMutate: ({ done }) => {
            const original: Array<TodoTO> | undefined = queryClient.getQueryData(["todos"]);
            queryClient.setQueryData(
                ["todos"],
                original?.map((todo) => (todo.id === id ? { ...todo, done } : todo)),
            );
            return original;
        },
        onError(error, variables, original) {
            queryClient.setQueryData(["todos"], original);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
}
