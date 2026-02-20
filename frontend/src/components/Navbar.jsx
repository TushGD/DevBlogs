import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `transition hover:text-amber-300 ${isActive ? "text-amber-300" : "text-slate-200"}`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-white">
          Dev<span className="text-amber-300">Blogs</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/create" className={linkClass}>
              Create
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-amber-300 px-4 py-2 text-slate-900 transition hover:bg-amber-200"
              >
                Join
              </NavLink>
            </>
          ) : (
            <>
              <span className="hidden text-slate-300 sm:inline">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-2 text-slate-100 transition hover:border-amber-300 hover:text-amber-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
