import { QueryClient } from "@tanstack/react-query";
import { render as tlRender, RenderOptions, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { AppProviders } from "../lib/app-providers";

type CustomRenderResult = RenderResult & { user: ReturnType<typeof userEvent.setup> };

function customRender(element: ReactElement, options?: RenderOptions): CustomRenderResult {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { refetchOnWindowFocus: false, retry: false },
        },
    });

    const user = userEvent.setup();
    const result = tlRender(element, {
        wrapper: ({ children }) => (
            <AppProviders queryClient={queryClient}>{children}</AppProviders>
        ),
        ...options,
    });

    return { ...result, user };
}

export * from "@testing-library/react";
export { customRender as render };
