import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createAxiosInstance } from "../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const api = createAxiosInstance("");
      const res = await api.post("/auth/login", { email, password });

      login(res.data.token, res.data.role); // store token + role
      navigate("/"); // redirect to dashboard
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6">
          Sweet Shop Login
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-center mb-3">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link className="text-indigo-600 font-semibold" to="/register">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
