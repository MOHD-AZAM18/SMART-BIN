import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sweeper");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:4000/api/auth/login"
        : "http://localhost:4000/api/auth/signup";

      const bodyData = isLogin
        ? { email, password }
        : { name, email, password, role };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // Save user in context
      login(data);

      // Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error("Auth Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
        <h2 className="text-center mb-3 fw-bold">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <p className="text-center text-muted mb-4">
          {isLogin
            ? "Welcome back to SmartSweep"
            : "Create your SmartSweep account"}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role (Signup only) */}
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="driver">Driver</option>
                <option value="sweeper">Sweeper</option>
              </select>
            </div>
          )}

          <button className="btn btn-dark w-100 py-2 mt-2">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-4">
          <span className="text-muted">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <button
            className="btn btn-link text-dark fw-bold p-0 ms-1 text-decoration-none"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;