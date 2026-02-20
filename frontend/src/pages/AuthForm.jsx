import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode = "login" }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const payload = isLogin ? { email, password } : { name, email, password };
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8">
      <h1 className="text-3xl font-bold text-white">{isLogin ? "Welcome back" : "Create account"}</h1>
      <p className="mt-2 text-sm text-slate-300">
        {isLogin ? "Login to manage and publish your posts." : "Join to start writing your first post."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
          required
          minLength={6}
        />

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          disabled={submitting}
          className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-slate-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        {isLogin ? "No account yet? " : "Already have an account? "}
        <Link to={isLogin ? "/register" : "/login"} className="text-amber-300 hover:text-amber-200">
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </section>
  );
}
