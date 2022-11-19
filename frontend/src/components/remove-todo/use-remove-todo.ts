import { useQueryClient, useMutation } from "@tanstack/react-query";
import { validateResponse } from "../../lib/api";

export function useRemoveTodo({ id }: { id: string }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () =>
            fetch(`/api/todos/${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { accept: "application/json" },
            }).then(validateResponse),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
}
