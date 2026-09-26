import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import "./index.css";
import App from "./App.tsx";
import { Login } from "./components/Login.tsx";
import { Register } from "./components/Register.tsx";
import { Dashboard } from "./components/Dashboard.tsx";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { HomePage } from "./components/HomePage.tsx";


// const HomeRedirect = () => {
//   const { accessToken } = useAuth();
//   return accessToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
// };

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route
                path="login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="register"
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
