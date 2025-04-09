import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Rewards from "@/pages/Rewards";
import Faq from "@/pages/Faq";
import LoanDetails from "@/pages/LoanDetails";
import PaydownPayment from "@/pages/PaydownPayment";
import PayoffPayment from "@/pages/PayoffPayment";
import ReschedulePayment from "@/pages/ReschedulePayment";
import DeferPayment from "@/pages/DeferPayment";
import MakePayment from "@/pages/MakePayment";
import RequestFunds from "@/pages/RequestFunds";
import PaymentHistory from "@/pages/PaymentHistory";
import AuthPage from "@/pages/AuthPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  const [location] = useLocation();
  
  // Check if current route is a payment page, which already includes a layout
  const isPaymentPage = location.includes('/paydown') || location.includes('/payoff') || 
                        location.includes('/reschedule') || location.includes('/defer') || 
                        location.includes('/payments');
  
  return (
    <>
      {isPaymentPage ? (
        <Switch>
          <ProtectedRoute path="/loans/:id/paydown" component={PaydownPayment} />
          <ProtectedRoute path="/loans/:id/payoff" component={PayoffPayment} />
          <ProtectedRoute path="/loans/:id/reschedule" component={ReschedulePayment} />
          <ProtectedRoute path="/loans/:id/defer" component={DeferPayment} />
          <ProtectedRoute path="/loans/:id/payments" component={PaymentHistory} />
        </Switch>
      ) : (
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={() => (
            <Layout>
              <Dashboard />
            </Layout>
          )} />
          <ProtectedRoute path="/profile" component={() => (
            <Layout>
              <Profile />
            </Layout>
          )} />
          <ProtectedRoute path="/rewards" component={() => (
            <Layout>
              <Rewards />
            </Layout>
          )} />
          <ProtectedRoute path="/faq" component={() => (
            <Layout>
              <Faq />
            </Layout>
          )} />
          <ProtectedRoute path="/make-payment" component={() => (
            <Layout>
              <MakePayment />
            </Layout>
          )} />
          <ProtectedRoute path="/request-funds" component={() => (
            <Layout>
              <RequestFunds />
            </Layout>
          )} />
          <ProtectedRoute path="/loans/:id" component={() => (
            <Layout>
              <LoanDetails />
            </Layout>
          )} />
          <Route component={NotFound} />
        </Switch>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
