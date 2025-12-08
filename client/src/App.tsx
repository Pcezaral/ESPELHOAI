import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Planos from "./pages/Planos";
import { useEffect } from "react";

function MobileViewportFix() {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    document.addEventListener('touchstart', preventZoom, { passive: false });

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      document.removeEventListener('touchstart', preventZoom);
    };
  }, []);

  return null;
}

function Router() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/generator"} component={Generator} />
        <Route path={"/gallery"} component={Gallery} />
        <Route path={"/about"} component={About} />
        <Route path={"/planos"} component={Planos} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <MobileViewportFix />
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                fontSize: '16px',
                padding: '12px 16px',
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
