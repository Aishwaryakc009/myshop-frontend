import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetch('https://myshop-backend-x6fu.onrender.com/api/orders/myorders', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <h2 style={{ padding: '40px' }}>Loading orders...</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Orders</h1>
      {orders.length === 0 ? (
        <div style={styles.empty}>
          <h2>No orders yet! 🛒</h2>
          <Link to="/" style={styles.shopBtn}>Start Shopping</Link>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>Order ID: {order._id}</p>
                  <p style={styles.date}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div style={styles.right}>
                  <span style={styles.statusBadge}>{order.status}</span>
                  <p style={styles.total}>₹{order.totalPrice}</p>
                </div>
              </div>
              <div style={styles.items}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.item}>
                    <img src={item.image} alt={item.name} style={styles.image} />
                    <div>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemPrice}>₹{item.price} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 40px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  heading: {
    color: '#1a1a2e',
    marginBottom: '30px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '20px',
  },
  shopBtn: {
    padding: '12px 30px',
    backgroundColor: '#e94560',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f5f5f5',
  },
  orderId: {
    margin: '0 0 5px 0',
    fontSize: '13px',
    color: '#888',
  },
  date: {
    margin: 0,
    fontSize: '14px',
    color: '#555',
  },
  right: {
    textAlign: 'right',
  },
  statusBadge: {
    display: 'inline-block',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '13px',
    marginBottom: '8px',
  },
  total: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#e94560',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  image: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  itemName: {
    margin: '0 0 5px 0',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  itemPrice: {
    margin: 0,
    color: '#555',
    fontSize: '14px',
  },
};

export default MyOrders;