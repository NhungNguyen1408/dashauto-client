import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/auth.service";
import { getStats } from "../services/dashboard.service";
import "./Dashboard.css";

const formatMoney = (n) =>
  new Intl.NumberFormat("vi-VN").format(n || 0) + " d";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.response?.data?.message || "Loi tai du lieu"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cards = stats
    ? [
        { label: "Tong doanh thu", value: formatMoney(stats.totalRevenue), color: "#4a90e2" },
        { label: "So don hang", value: stats.totalOrders, color: "#50c878" },
        { label: "San pham ban ra", value: stats.productsSold, color: "#f5a623" },
        { label: "Bao cao da tao", value: stats.totalReports, color: "#9b59b6" },
        { label: "Canh bao mo", value: stats.openAlerts, color: "#e74c3c" },
      ]
    : [];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-user">
          <span>
            {user?.username} ({user?.role})
          </span>
          <button onClick={handleLogout}>Dang xuat</button>
        </div>
      </header>

      {loading && <p>Dang tai...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      <section className="stat-grid">
        {cards.map((c) => (
          <div key={c.label} className="stat-card" style={{ borderLeftColor: c.color }}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;
