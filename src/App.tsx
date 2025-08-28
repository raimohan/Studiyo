import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Notes from "@/pages/notes";
import Admin from "@/pages/admin";
import Auth from "@/pages/auth";
import Profile from "@/pages/profile";
import Forum from "@/pages/forum";
import Navigation from "@/components/navigation";
import AIAssistant from "@/components/ai-assistant";

function LandingRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Redirect to="/dashboard" />;
  }
  
  return <Landing />;
}

function AuthRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Redirect to="/dashboard" />;
  }
  
  return <Auth />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingRedirect} />
      <Route path="/auth" component={AuthRedirect} />
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
      <Route path="/planner">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/forum">
        <ProtectedRoute>
          <Forum />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
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
