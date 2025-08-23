import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Notes from "@/pages/notes";
import Admin from "@/pages/admin";
import Auth from "@/pages/auth";
import Navigation from "@/components/navigation";
import AIAssistant from "@/components/ai-assistant";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/chat">
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      </Route>
      <Route path="/notes">
        <ProtectedRoute>
          <Notes />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute adminOnly>
          <Admin />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-pastel-beige">
            <Navigation />
            <Router />
            <AIAssistant />
            <Toaster />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
