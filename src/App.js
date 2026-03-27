import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  // ✅ AUTO LOGIN (LOAD USER FROM LOCAL STORAGE)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  };

  // 🔓 NOT LOGGED IN
  if (!user) {
    if (page === "register") {
      return <Register goToLogin={() => setPage("login")} />;
    }

    return (
      <Login
        setUser={setUser}
        goToRegister={() => setPage("register")}
      />
    );
  }

  // 👑 ADMIN DASHBOARD
  if (user.role === "ADMIN") {
    return <AdminDashboard user={user} onLogout={logout} />;
  }

  // 👤 USER DASHBOARD
  return <UserDashboard user={user} onLogout={logout} />;
}

export default App;