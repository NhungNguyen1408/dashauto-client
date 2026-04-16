import { useEffect, useState } from "react";
import { getStats } from "../services/dashboard.service";
import RevenueChart from "../components/RevenueChart";
import TopProductsChart from "../components/TopProductsChart";
import KpiChart from "../components/KpiChart";
import "./Dashboard.css";

const formatMoney = (n) =>
  new Intl.NumberFormat("vi-VN").format(n || 0) + " d";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.response?.data?.message || "Loi tai du lieu"))
      .finally(() => setLoading(false));
  }, []);

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
    <div>
      <h1>Dashboard</h1>

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

      <section className="chart-section">
        <RevenueChart />
        <TopProductsChart />
        <KpiChart />
      </section>
    </div>
  );
}

export default Dashboard;
