import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import App from "./app/App.tsx";
import "./styles/index.css";

// Code-split admin routes so public visitors load the site instantly
const AdminLogin = lazy(() => import("./admin/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("./admin/AdminLayout.tsx"));
const DashboardOverview = lazy(() => import("./admin/DashboardOverview.tsx"));
const ManageCertificates = lazy(() => import("./admin/ManageCertificates.tsx"));
const ManageProjects = lazy(() => import("./admin/ManageProjects.tsx"));
const ManageMessages = lazy(() => import("./admin/ManageMessages.tsx"));
const ProtectedRoute = lazy(() => import("./admin/ProtectedRoute.tsx"));

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-black text-[#00D23B] flex flex-col items-center justify-center font-mono text-xs">
      <div className="w-6 h-6 border-2 border-[#00D23B] border-t-transparent rounded-full animate-spin mb-3" />
      <span>&gt; INITIALIZING_SECURE_CONSOLE...</span>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<App />} />

        {/* Admin Authentication */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Control Center */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="certificates" element={<ManageCertificates />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="messages" element={<ManageMessages />} />
        </Route>

        {/* Fallback to Public Site */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
