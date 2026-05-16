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
      <h1>Products</h1>

      <div className="filters">
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Laptop">Laptop</option>
            <option value="Accessories">Accessories</option>
            <option value="Monitor">Monitor</option>
            <option value="Audio">Audio</option>
          </select>
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Status</th>
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