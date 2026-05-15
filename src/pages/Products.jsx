import { useEffect, useState } from "react";
import { listProducts } from "../services/product.service";
import "./Reports.css";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " VND";

function Products() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (status) params.status = status;

    listProducts(params)
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [category, status]);

  return (
    <div className="page">
      <h1>San pham</h1>

      <div className="filters">
        <label>
          Danh muc
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tat ca</option>
            <option value="Laptop">Laptop</option>
            <option value="Phu kien">Phu kien</option>
            <option value="Man hinh">Man hinh</option>
            <option value="Am thanh">Am thanh</option>
          </select>
        </label>

        <label>
          Trang thai
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tat ca</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
              <th>SKU</th>
              <th>Ten san pham</th>
              <th>Danh muc</th>
              <th>Gia</th>
              <th>Ton kho</th>
              <th>Da ban</th>
              <th>Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatMoney(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.sold}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Products;