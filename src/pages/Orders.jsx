import { useEffect, useState } from "react";
import { listOrders } from "../services/order.service";
import "./Reports.css";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " VND";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString("vi-VN") : "-";

function Orders() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (status) params.status = status;
    if (region) params.region = region;

    listOrders(params)
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [status, region]);

  return (
    <div className="page">
      <h1>Orders</h1>
      <p className="page-desc">
        Manage the order list, status, region, and revenue of each order.
      </p>

      <div className="filters">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label>
          Region
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All</option>
            <option value="Ha Noi">Ha Noi</option>
            <option value="Da Nang">Da Nang</option>
            <option value="Ho Chi Minh">Ho Chi Minh</option>
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
              <th>Order Code</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Region</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">
                  No data available
                </td>
              </tr>
            ) : (
              items.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.order_code}</td>
                  <td>{o.customer_name}</td>
                  <td>{formatMoney(o.total_amount)}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        o.status === "completed"
                          ? "success"
                          : o.status === "cancelled"
                          ? "failed"
                          : "warning"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td>{o.region}</td>
                  <td>{formatDate(o.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;