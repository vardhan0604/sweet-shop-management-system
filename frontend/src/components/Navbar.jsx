import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!token) return null; // hide navbar when not logged in

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      
      {/* Logo / Title */}
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        Sweet Shop
      </Link>

      <div className="flex items-center gap-6">

        {/* Admin label */}
        {role === "admin" && (
          <span className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-full">
            Admin
          </span>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
