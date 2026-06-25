import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#1F5C99", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;