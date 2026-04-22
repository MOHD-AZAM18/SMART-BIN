import React, { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
        <h2 className="text-center mb-3 fw-bold">{isLogin ? "Login" : "Sign Up"}</h2>
        <p className="text-center text-muted mb-4">
          {isLogin ? "Welcome back to SmartSweep" : "Create your SmartSweep account"}
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="John Doe" />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="name@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>
          <button className="btn btn-dark w-100 py-2 mt-2">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
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