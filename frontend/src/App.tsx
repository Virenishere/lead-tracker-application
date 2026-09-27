import { Outlet } from "react-router-dom";
import { Navbar } from "./components/personal-ui/Navbar";
import { Toaster } from "./components/ui/toast";
import { StartLoader } from "./components/personal-ui/startLoader";

function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
        <StartLoader />
        <Navbar />
        <main className="flex-1 py-8">
          <Outlet />
        </main>
        <footer className="py-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LeadFlow. Built for modern sales teams.
        </footer>
        <Toaster />
    </div>
  );
}

export default App;