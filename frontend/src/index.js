import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./routes/login";
import RootPage from "./routes/root";
import VerifyDecodeSecurePage from "./routes/verifyDecodeSecure";
import VerifyDecodeUnsecurePage from "./routes/verifyDecodeUnsecure";
import CrackSecretPage from "./routes/crackSecret";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/verify-secure",
    element: <VerifyDecodeSecurePage />,
  },
  {
    path: "/verify-unsecure",
    element: <VerifyDecodeUnsecurePage />,
  },
  {
    path: "/crack",
    element: <CrackSecretPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
