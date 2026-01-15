import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { SecureStorageProvider } from "@/contexts/SecureStorageContext";
import { VaultGuard } from "@/components/vault/VaultGuard";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Balancing from "./pages/Balancing";
import Transactions from "./pages/Transactions";
import Dividends from "./pages/Dividends";
import Taxes from "./pages/Taxes";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";

const queryClient = new QueryClient();

function ProtectedLayout() {
  return (
    <VaultGuard>
      <Outlet />
    </VaultGuard>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecureStorageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* OAuth callback MUST bypass the vault guard (popup should never ask for vault password) */}
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            <Route path="/auth/google/callback.html" element={<GoogleAuthCallback />} />

            {/* Everything else is protected by the vault */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/balancing" element={<Balancing />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/dividends" element={<Dividends />} />
              <Route path="/taxes" element={<Taxes />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SecureStorageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
