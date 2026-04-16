import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getKpi } from "../services/dashboard.service";

const formatMoney = (n) => new Intl.NumberFormat("vi-VN").format(n);

function KpiChart() {
  const [by, setBy] = useState("region");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getKpi(by)
      .then(setData)
      .finally(() => setLoading(false));
  }, [by]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2>KPI</h2>
        <div className="chart-toggle">
          <button
            className={by === "region" ? "active" : ""}
            onClick={() => setBy("region")}
          >
            Khu vuc
          </button>
          <button
            className={by === "employee" ? "active" : ""}
            onClick={() => setBy("employee")}
          >
            Nhan vien
          </button>
        </div>
      </div>

      {loading ? (
        <p>Dang tai...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" tickFormatter={formatMoney} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(v, name) => (name === "revenue" ? formatMoney(v) + " d" : v)} />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#4a90e2" name="Doanh thu" />
            <Bar yAxisId="right" dataKey="orders" fill="#f5a623" name="So don" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default KpiChart;
