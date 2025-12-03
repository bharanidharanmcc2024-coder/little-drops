import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientProvider } from "@/contexts/PatientContext";
import LoginPage from "@/components/LoginPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Admission from "@/pages/Admission";
import DeathRegistration from "@/pages/DeathRegistration";
import HealthRecords from "@/pages/HealthRecords";
import SearchPatients from "@/pages/SearchPatients";
import UserManagement from "@/pages/UserManagement";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PatientProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admission" element={<Admission />} />
                <Route path="/death" element={<DeathRegistration />} />
                <Route path="/health" element={<HealthRecords />} />
                <Route path="/search" element={<SearchPatients />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PatientProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
