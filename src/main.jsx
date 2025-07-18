import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";

import { getValue } from "./configs/env";
import router from "./app/router";
import queryClient from "./app/query-client";
import "./app/index.css";

const root = document.getElementById("root");

if (!root) throw new Error("No root element found");

const shouldShowDevTools = getValue("nodeEnv") === "dev";

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {shouldShowDevTools && <ReactQueryDevtools />}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
