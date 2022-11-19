import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiError, TodoTO, validateResponse } from "../../lib/api";

export function useTodos(): UseQueryResult<Array<TodoTO>, ApiError> {
    return useQuery({
        queryKey: ["todos"],
        queryFn: () =>
            fetch("/api/todos", {
                headers: { accept: "application/json" },
            }).then(validateResponse),
    });
}
