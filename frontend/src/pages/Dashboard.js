import React, { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Dashboard</h2>
      {user && (
        <div>
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <p>Email: {user.email}</p>
          <p style={{ color: "green" }}>You are logged in successfully.</p>
        </div>
      )}
      <button onClick={handleLogout} style={{ padding: "10px 20px", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;