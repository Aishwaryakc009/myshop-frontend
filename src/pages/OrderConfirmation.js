import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OrderConfirmation() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://myshop-backend-x6fu.onrender.com/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [id, user]);

  if (loading) return <h2 style={{ padding: '40px' }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Order Placed Successfully!</h1>
        <p style={styles.orderId}>Order ID: {order._id}</p>
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
        <div style={styles.total}>
          <span>Total Paid</span>
          <span style={styles.totalPrice}>₹{order.totalPrice}</span>
        </div>
        <div style={styles.status}>
          Status: <span style={styles.statusBadge}>{order.status}</span>
        </div>
        <Link to="/" style={styles.homeBtn}>Continue Shopping</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
    height: 'fit-content',
  },
  icon: {
    fontSize: '60px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  orderId: {
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
    marginBottom: '30px',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '25px',
  },
  item: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f5f5f5',
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
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderTop: '2px solid #f5f5f5',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  totalPrice: {
    color: '#e94560',
  },
  status: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '15px',
    color: '#555',
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  homeBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '14px',
    backgroundColor: '#e94560',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

export default OrderConfirmation;