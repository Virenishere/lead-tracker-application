import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import svgLogo from "../../assets/logo.svg"
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { useAuth } from "../../context/auth-hook";
import { RippleButton } from "../ui/ripple-button";

export const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-3 sm:py-4 transition-colors duration-200">
      <nav className="flex justify-between items-center gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <img src={svgLogo} width={32} height={32} alt="LeadFlow Logo" className="dark:invert transition-transform group-hover:scale-105 sm:w-9 sm:h-9" />
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">LeadFlow</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <RippleButton className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors">
                  Dashboard
                </RippleButton>
              </Link>
              <RippleButton
                onClick={logout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                Logout
              </RippleButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <RippleButton className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors">
                  Login
                </RippleButton>
              </Link>
              <Link to="/register">
                <RippleButton className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity">
                  Register
                </RippleButton>
              </Link>
            </>
          )}

          <AnimatedThemeToggler
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            onThemeChange={setTheme}
            className="p-2 sm:p-2.5 rounded-full border border-border bg-card text-foreground hover:bg-accent transition-colors cursor-pointer"
          />
        </div>
      </nav>
    </header>
  );
};
