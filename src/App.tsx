import React, { useState, useEffect } from "react";
import "./App.css";

type User = {
  username: string;
  password: string;
  photo?: string;
};

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

  // Profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPhoto, setEditPhoto] = useState<string | undefined>();

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

  // Login
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

  // Register
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

  // Profile edit
  const startEdit = () => {
    if (!currentUser) return;
    setEditUsername(currentUser.username);
    setEditPassword(currentUser.password);
    setEditPhoto(currentUser.photo);
    setIsEditing(true);
  };

  const saveProfile = () => {
    if (!currentUser) return;
    const updatedUser: User = {
      username: editUsername,
      password: editPassword,
      photo: editPhoto,
    };
    setUsers(users.map(u => u.username === currentUser.username ? updatedUser : u));
    setCurrentUser(updatedUser);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Dashboard content
  const renderDashboardContent = () => {
    switch (dashboardSection) {
      case "profile":
        return (
          <div className="content-card animate">
            <h1>Profile</h1>
            {!isEditing ? (
              <>
                <img src={currentUser?.photo || "/default-avatar.png"} className="profile-pic" alt="profile" />
                <p>Username: <strong>{currentUser?.username}</strong></p>
                <button className="btn" onClick={startEdit}>Edit Profile</button>
              </>
            ) : (
              <>
                <img src={editPhoto || "/default-avatar.png"} className="profile-pic" alt="preview" />
                <input type="file" onChange={handlePhotoUpload} className="input" />
                <input className="input" value={editUsername} onChange={e => setEditUsername(e.target.value)} placeholder="Username" />
                <input className="input" type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Password" />
                <button className="btn" onClick={saveProfile}>Save</button>
                <button className="btn return-btn animate-return" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            )}
          </div>
        );

      case "settings":
        return <div className="content-card animate"><h1>Settings</h1><p>Customize your dashboard settings.</p></div>;
      case "about":
        return <div className="content-card animate"><h1>About</h1><p>Built with React & TypeScript.</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="container with-bg">
      {/* Home */}
      {page === "home" && (
        <div className="welcome-card animate-bounce">
          <div className="home-buttons">
            <button className="btn" onClick={() => setPage("login")}>Login</button>
            <button className="btn" onClick={() => setPage("register")}>Register</button>
          </div>
        </div>
      )}

      {/* Login */}
      {page === "login" && (
        <div className="auth-wrapper animate-bounce">
          <div className="auth-card neumorphic-card">
            <h1>Login</h1>
            <input className="input" placeholder="Username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            {loginError && <p className="error-msg">{loginError}</p>}
            <button className="btn" onClick={handleLogin}>Login</button>
          </div>
          <div className="auth-image">
            <img src="/pexels-molnartamasphotography-33353366.jpg" alt="login" />
          </div>
        </div>
      )}

      {/* Register */}
      {page === "register" && (
        <div className="auth-wrapper animate-bounce">
          <div className="auth-card neumorphic-card">
            <h1>Register</h1>
            <input className="input" placeholder="Username" value={regUsername} onChange={e => setRegUsername(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            {regError && <p className="error-msg">{regError}</p>}
            <button className="btn" onClick={handleRegister}>Register</button>
          </div>
          <div className="auth-image">
            <img src="/pexels-molnartamasphotography-33353366.jpg" alt="register" />
          </div>
        </div>
      )}

      {/* Dashboard */}
      {page === "dashboard" && currentUser && (
        <div className="dashboard">
          <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</div>
          {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <h2>Menu</h2>
            <ul>
              <li onClick={() => setDashboardSection("profile")}>👤 Profile</li>
              <li onClick={() => setDashboardSection("settings")}>⚙️ Settings</li>
              <li onClick={() => setDashboardSection("about")}>ℹ️ About</li>
              <li onClick={handleLogout}>🔓 Logout</li>
            </ul>
          </div>
          <div className="main">{renderDashboardContent()}</div>
        </div>
      )}

      {/* Global Return Button (only for login/register) */}
      {page !== "home" && page !== "dashboard" && (
        <div
          className="return-btn animate-return"
          onClick={() => setPage("home")}
        >
          ⬅ Return
        </div>
      )}
    </div>
  );
};

export default App;