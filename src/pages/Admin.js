import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', image: '', description: '', category: '', stock: ''
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user, navigate]);

  const fetchProducts = async () => {
    const res = await fetch('https://myshop-backend-x6fu.onrender.com/api/admin/products', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const res = await fetch('https://myshop-backend-x6fu.onrender.com/api/admin/orders', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`https://myshop-backend-x6fu.onrender.com/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const url = editProduct
      ? `https://myshop-backend-x6fu.onrender.com/api/admin/products/${editProduct._id}`
      : 'https://myshop-backend-x6fu.onrender.com/api/admin/products';
    const method = editProduct ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      }),
    });
    setShowForm(false);
    setEditProduct(null);
    setFormData({ name: '', price: '', image: '', description: '', category: '', stock: '' });
    fetchProducts();
  };

  if (loading) return <h2 style={{ padding: '40px' }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🔧 Admin Panel</h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'products' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          style={activeTab === 'orders' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditProduct(null); setFormData({ name: '', price: '', image: '', description: '', category: '', stock: '' }); }}>
            {showForm ? 'Cancel' : '+ Add New Product'}
          </button>

          {/* Add/Edit Form */}
          {showForm && (
            <div style={styles.form}>
              <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              {['name', 'price', 'image', 'description', 'category', 'stock'].map((field) => (
                <div key={field} style={styles.inputGroup}>
                  <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    style={styles.input}
                    type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                    placeholder={field}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                </div>
              ))}
              <button style={styles.submitBtn} onClick={handleSubmit}>
                {editProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          )}

          {/* Products Table */}
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Product</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Actions</span>
            </div>
            {products.map((product) => (
              <div key={product._id} style={styles.tableRow}>
                <div style={styles.productCell}>
                  <img src={product.image} alt={product.name} style={styles.productImg} />
                  <span>{product.name}</span>
                </div>
                <span>₹{product.price}</span>
                <span>{product.stock}</span>
                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => handleEdit(product)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderId}>Order: {order._id}</p>
                  <p style={styles.orderUser}>
                    Customer: {order.user?.name} ({order.user?.email})
                  </p>
                  <p style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div style={styles.orderRight}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: order.isPaid ? '#e8f5e9' : '#fff3e0',
                    color: order.isPaid ? '#2e7d32' : '#e65100',
                  }}>
                    {order.status}
                  </span>
                  <p style={styles.orderTotal}>₹{order.totalPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px 40px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  heading: { color: '#1a1a2e', marginBottom: '25px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
  tab: { padding: '10px 25px', backgroundColor: 'white', border: '2px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  activeTab: { padding: '10px 25px', backgroundColor: '#1a1a2e', color: 'white', border: '2px solid #1a1a2e', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
  addBtn: { padding: '12px 25px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', fontSize: '15px' },
  form: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold', fontSize: '14px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '15px', boxSizing: 'border-box' },
  submitBtn: { padding: '12px 30px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  table: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '15px 20px', backgroundColor: '#1a1a2e', color: 'white', fontWeight: 'bold' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '15px 20px', borderBottom: '1px solid #f5f5f5', alignItems: 'center' },
  productCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  productImg: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { padding: '6px 14px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 14px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  orderCard: { backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { margin: '0 0 5px 0', fontSize: '13px', color: '#888' },
  orderUser: { margin: '0 0 5px 0', fontWeight: 'bold', color: '#1a1a2e' },
  orderDate: { margin: 0, fontSize: '13px', color: '#555' },
  orderRight: { textAlign: 'right' },
  statusBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' },
  orderTotal: { margin: '8px 0 0 0', fontWeight: 'bold', color: '#e94560', fontSize: '18px' },
};

export default Admin;