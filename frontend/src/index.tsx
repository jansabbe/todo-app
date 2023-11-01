import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import { QueryClient } from "@tanstack/react-query";
import { AppProviders } from "./lib/app-providers";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 2, retryDelay: 500 } },
});

root.render(
    <AppProviders queryClient={queryClient}>
        <App />
    </AppProviders>,
);
