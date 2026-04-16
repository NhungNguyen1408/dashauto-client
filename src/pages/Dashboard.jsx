import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/auth.service";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>
        Xin chao <strong>{user?.username}</strong> ({user?.role})
      </p>
      <button onClick={handleLogout}>Dang xuat</button>
    </div>
  );
}

export default Dashboard;
