import React, { useState, useEffect } from "react";
import "./App.css";

type User = { username: string; password: string; };

const App: React.FC = () => {
  const [page, setPage] = useState<"home" | "login" | "register" | "dashboard">("home");
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardSection, setDashboardSection] = useState<"profile" | "settings" | "about">("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [regError, setRegError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Load persistent login
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setPage("dashboard");
    }
  }, []);

  // Save users
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Save currentUser only if rememberMe is true
  useEffect(() => {
    if (currentUser && rememberMe) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser, rememberMe]);

  const handleLogin = () => {
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
      setPage("dashboard");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleRegister = () => {
    if (!regUsername || !regPassword) {
      setRegError("Enter username and password");
      return;
    }
    if (users.find(u => u.username === regUsername)) {
      setRegError("Username already exists");
      return;
    }
    setUsers([...users, { username: regUsername, password: regPassword }]);
    setRegUsername("");
    setRegPassword("");
    setRegError("");
    setPage("login");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("home");
    setDashboardSection("profile");
    setSidebarOpen(false);
    setRememberMe(false);
    localStorage.removeItem("currentUser");
  };

  const renderDashboardContent = () => {
    switch(dashboardSection) {
      case "profile": return (
        <div className="content-card animate">
          <h1>Profile</h1>
          <p>Username: <strong>{currentUser?.username}</strong></p>
        </div>
      );
      case "settings": return (
        <div className="content-card animate">
          <h1>Settings</h1>
          <p>Customize your dashboard settings here.</p>
        </div>
      );
      case "about": return (
        <div className="content-card animate">
          <h1>About</h1>
          <p>This SaaS-style dashboard is built with React & TypeScript, with modern neumorphic UI.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="container">
      {/* Home */}
     {page === "home" && (
  <div className="welcome-card animate-bounce">
    <h1 className="welcome-title">Welcome to My Personal Dashboard</h1>
    <div className="home-buttons">
      <button className="btn" onClick={() => setPage("login")}>Login</button>
      <button className="btn" onClick={() => setPage("register")}>Register</button>
    </div>
  </div>
)}

      {/* Login */}
      {page === "login" && (
        <div className="card neumorphic-card">
          <h1 className="title">Login</h1>
          <input className="input neumorphic-input" type="text" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
          <input className="input neumorphic-input" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          
          <label className="remember-me">
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} /> Remember Me
          </label>

          {loginError && <p className="error-msg">{loginError}</p>}
          <button className="btn" onClick={handleLogin}>Login</button>
          <span className="link" onClick={() => setPage("register")}>Don't have an account? Register</span>
          <span className="link" onClick={() => setPage("home")}>Back to Home</span>
        </div>
      )}

      {/* Register */}
      {page === "register" && (
        <div className="card neumorphic-card">
          <h1 className="title">Register</h1>
          <input className="input neumorphic-input" type="text" placeholder="Username" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} />
          <input className="input neumorphic-input" type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
          {regError && <p className="error-msg">{regError}</p>}
          <button className="btn" onClick={handleRegister}>Register</button>
          <span className="link" onClick={() => setPage("login")}>Already have an account? Login</span>
          <span className="link" onClick={() => setPage("home")}>Back to Home</span>
        </div>
      )}

      {/* Dashboard */}
      {page === "dashboard" && currentUser && (
        <div className="dashboard">
          <div className="hamburger" onClick={() => setSidebarOpen(true)}>☰</div>
          {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <h2>Menu</h2>
            <ul>
              <li className={dashboardSection === "profile" ? "active" : ""} onClick={() => { setDashboardSection("profile"); setSidebarOpen(false); }}>
                <span className="icon">👤</span>
                <span className="text">Profile</span>
              </li>
              <li className={dashboardSection === "settings" ? "active" : ""} onClick={() => { setDashboardSection("settings"); setSidebarOpen(false); }}>
                <span className="icon">⚙️</span>
                <span className="text">Settings</span>
              </li>
              <li className={dashboardSection === "about" ? "active" : ""} onClick={() => { setDashboardSection("about"); setSidebarOpen(false); }}>
                <span className="icon">ℹ️</span>
                <span className="text">About</span>
              </li>
              <li onClick={handleLogout}>
                <span className="icon">🔓</span>
                <span className="text">Logout</span>
              </li>
            </ul>
          </div>

          <div className="main">
            {renderDashboardContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;