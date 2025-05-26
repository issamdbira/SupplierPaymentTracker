import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import FinancialSituation from "@/pages/financial-situation";
import Invoices from "@/pages/invoices";
import Payments from "@/pages/payments";
import ReceivablesPage from "@/pages/receivables";
import Suppliers from "@/pages/suppliers";
import Customers from "@/pages/customers";
import CustomerDashboard from "@/pages/customers/dashboard";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import WelcomePage from "@/pages/welcome";

// Mock authentication check hook
const useAuth = () => {
  // TODO: Replace with actual authentication logic (e.g., check token/session)
  // For now, assume the user is always authenticated after the initial load.
  // This simplified check might be the reason for redirection issues if the real app has auth.
  return { isAuthenticated: true };
};

// Component to protect routes and apply layout
const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated) {
    // Redirect to welcome page if not authenticated, preserving the intended path
    // return <Redirect to={`/?redirect=${encodeURIComponent(location)}`} />;
    // For now, since auth is mocked as true, this part won't execute.
    // If the dashboard redirects to welcome, it's likely not an auth issue with this mock.
    return <Redirect to="/" />;
  }

  // If authenticated, render the component within the AppLayout
  return (
    <AppLayout>
      <Component {...rest} />
    </AppLayout>
  );
};

// Main application router component
function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  // If authenticated and trying to access the root path, redirect to the dashboard.
  if (isAuthenticated && location === "/") {
    return <Redirect to="/dashboard" />;
  }

  // If not authenticated, only allow access to the WelcomePage at the root path.
  // Any other path attempt redirects to the root.
  if (!isAuthenticated && location !== "/") {
     // This shouldn't trigger with the current mock auth state.
     return <Redirect to="/" />;
  }

  return (
    <Switch>
      {/* Public Route: Only accessible when not authenticated (or root path initially) */}
      {/* If authenticated, the redirect above handles the root path. */}
      <Route path="/" component={WelcomePage} />

      {/* Protected Routes: Rendered using PrivateRoute which includes AppLayout */}
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/financial-situation" component={FinancialSituation} />
      <PrivateRoute path="/suppliers" component={Suppliers} />
      <PrivateRoute path="/customers" component={Customers} />
      <PrivateRoute path="/invoices" component={Invoices} />
      <PrivateRoute path="/payments" component={Payments} />
      <PrivateRoute path="/receivables" component={ReceivablesPage} />
      <PrivateRoute path="/settings" component={Settings} />

      {/* Specific sub-routes - ensure they are needed and handled correctly */}
      {/* These might need their own components or logic if different from parent */}
      <PrivateRoute path="/suppliers/invoices" component={Invoices} />
      <PrivateRoute path="/customers/dashboard" component={CustomerDashboard} />
      {/* Removed /customers/receivables as /receivables covers it now */}

      {/* Fallback for unknown routes when authenticated (rendered within AppLayout) */}
      {/* The ':rest*' pattern catches any path not matched above */}
      <PrivateRoute path="/:rest*" component={NotFound} />

      {/* If a non-authenticated user tries an invalid path, they are redirected to "/" above. */}
      {/* Alternatively, a public NotFound could be added here if needed. */}
      {/* <Route component={PublicNotFound} /> */}
    </Switch>
  );
}

// Main App component setup
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRoutes /> {/* Use the refactored router component */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

