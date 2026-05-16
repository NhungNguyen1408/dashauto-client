import { useEffect, useState } from "react";
import { listWorkflowLogs, getWorkflowSummary } from "../services/workflow.service";
import "./Reports.css";
import "./Workflows.css";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString("vi-VN") : "-");

function Workflows() {
  const [summary, setSummary] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [workflowName, setWorkflowName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getWorkflowSummary().then(setSummary);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (workflowName) params.workflowName = workflowName;
    if (status) params.status = status;
    listWorkflowLogs(params)
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [workflowName, status]);

  return (
    <div className="page">
      <h1>Automation</h1>

      <section className="workflow-summary">
        {summary.map((w) => (
          <div key={w.workflowName} className="workflow-card">
            <div className="workflow-name">{w.workflowName}</div>
            <div className="workflow-last">
              Last Run: {formatDate(w.lastExecutedAt)}
            </div>
            <div className={`workflow-status badge badge-${w.lastStatus === "success" ? "success" : "failed"}`}>
              {w.lastStatus}
            </div>
            <div className="workflow-stats">
              <span className="stat-ok">✓ {w.successRuns}</span>
              <span className="stat-fail">✗ {w.failedRuns}</span>
              <span className="stat-total">/ {w.totalRuns}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="filters">
        <label>
          Workflow
          <select value={workflowName} onChange={(e) => setWorkflowName(e.target.value)}>
            <option value="">All</option>
            {summary.map((w) => (
              <option key={w.workflowName} value={w.workflowName}>
                {w.workflowName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
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
              <th>Workflow</th>
              <th>Status</th>
              <th>Log</th>
              <th>Run Time</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">No data available</td>
              </tr>
            ) : (
              items.map((w) => (
                <tr key={w.id}>
                  <td>{w.id}</td>
                  <td>{w.workflow_name}</td>
                  <td>
                    <span className={`badge badge-${w.status === "success" ? "success" : "failed"}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="content-cell">{w.message}</td>
                  <td>{formatDate(w.executed_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Workflows;