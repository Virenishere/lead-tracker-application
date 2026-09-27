import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth-hook";
import { API_BASE_URL } from "../config/api";
import { toast } from "./ui/toast-manager";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Registration failed");
      }

      login(data.data.user);
      toast.success("Account Created", `Welcome to Lead Tracker, ${data.data.user.name || 'User'}!`);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register";
      setError(msg);
      toast.error("Registration Failed", msg);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start tracking and converting your sales leads today</p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground transition-all placeholder:text-muted-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground transition-all placeholder:text-muted-foreground"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground transition-all placeholder:text-muted-foreground"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-lg bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Create Account
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80">
          Login
        </Link>
      </div>
    </div>
  );
};
