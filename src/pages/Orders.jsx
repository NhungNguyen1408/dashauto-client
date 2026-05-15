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
      <h1>Don hang</h1>
      <p className="page-desc">
        Quan ly danh sach don hang, trang thai, khu vuc va doanh thu tung don.
      </p>

      <div className="filters">
        <label>
          Trang thai
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tat ca</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label>
          Khu vuc
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Tat ca</option>
            <option value="Ha Noi">Ha Noi</option>
            <option value="Da Nang">Da Nang</option>
            <option value="Ho Chi Minh">Ho Chi Minh</option>
          </select>
        </label>

        <span className="total">Tong: {total}</span>
      </div>

      {loading ? (
        <p>Dang tai...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ma don</th>
              <th>Khach hang</th>
              <th>So tien</th>
              <th>Trang thai</th>
              <th>Khu vuc</th>
              <th>Thoi gian</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">
                  Khong co du lieu
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