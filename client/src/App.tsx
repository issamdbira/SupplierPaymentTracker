import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import FinancialSituation from "@/pages/financial-situation";
import Invoices from "@/pages/invoices";
import Payments from "@/pages/payments";
import Suppliers from "@/pages/suppliers";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import WelcomePage from "@/pages/welcome";

function Router() {
  const [location] = useLocation();
  
  // Check if we're at the root/welcome page
  const isWelcomePage = location === "/";
  
  // If we're at welcome page, don't use AppLayout
  if (isWelcomePage) {
    return (
      <Switch>
        <Route path="/" component={WelcomePage} />
      </Switch>
    );
  }
  
  // Otherwise use AppLayout for rest of the app
  return (
    <AppLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/financial-situation" component={FinancialSituation} />
        <Route path="/suppliers/invoices" component={Invoices} />
        <Route path="/suppliers/payments" component={Payments} />
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/suppliers/dashboard" component={Dashboard} />
        <Route path="/customers" component={NotFound} /> {/* Placeholder for customer module */}
        <Route path="/customers/dashboard" component={NotFound} /> {/* Placeholder for customer dashboard */}
        <Route path="/customers/receivables" component={NotFound} /> {/* Placeholder for receivables */}
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
