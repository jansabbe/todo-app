import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactNode } from "react";

export function AppProviders({
    queryClient,
    children,
}: {
    queryClient: QueryClient;
    children: ReactNode;
}) {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </React.StrictMode>
    );
}
