import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { dark } from "@clerk/themes";
import toast, { Toaster } from "react-hot-toast";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl="/"
            appearance={{
                baseTheme: dark,
            }}>
            <ThemeProvider>
                <Toaster position="top-center" reverseOrder={false} />
                <App />{" "}
            </ThemeProvider>
        </ClerkProvider>
    </BrowserRouter>
);
