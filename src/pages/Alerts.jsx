import { useEffect, useState } from "react";
import { listAlerts, resolveAlert } from "../services/alert.service";
import { getUser } from "../services/auth.service";
import "./Reports.css";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString("vi-VN") : "-");

function Alerts() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const user = getUser();
  const canResolve = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (severity) params.severity = severity;
    if (status) params.status = status;
    listAlerts(params)
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [severity, status, reloadKey]);

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      setReloadKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || "Error processing alert");
    }
  };

  return (
    <div className="page">
      <h1>Alerts</h1>

      <div className="filters">
        <label>
          Severity
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>

        <span className="total">Total: {total}</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Message</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Time</th>
              <th>Resolved At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">No data available</td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.type}</td>
                  <td>{a.message}</td>
                  <td>
                    <span className={`badge badge-sev-${a.severity}`}>{a.severity}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${a.status === "open" ? "failed" : "success"}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>{formatDate(a.created_at)}</td>
                  <td>{formatDate(a.resolved_at)}</td>
                  <td>
                    {a.status === "open" && canResolve && (
                      <button className="resolve-btn" onClick={() => handleResolve(a.id)}>
                        Mark as Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Alerts;