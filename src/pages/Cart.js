import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, totalItems, setCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const orderRes = await fetch('https://myshop-backend-x6fu.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          totalPrice,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        alert(orderData.message);
        return;
      }

      const paymentRes = await fetch('https://myshop-backend-x6fu.onrender.com/api/orders/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const paymentData = await paymentRes.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: 'INR',
        name: 'MyShop',
        description: 'Order Payment',
        order_id: paymentData.id,
        handler: async (response) => {
          const verifyRes = await fetch('https://myshop-backend-x6fu.onrender.com/api/orders/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData._id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setCartItems([]);
            navigate(`/order/${orderData._id}`);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#e94560',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Something went wrong. Try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>Your cart is empty 🛒</h2>
        <Link to="/" style={styles.shopBtn}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Cart ({totalItems} items)</h1>
      <div style={styles.layout}>
        <div style={styles.itemsList}>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.card}>
              <img src={item.image} alt={item.name} style={styles.image} />
              <div style={styles.info}>
                <h3 style={styles.name}>{item.name}</h3>
                <p style={styles.price}>₹{item.price} x {item.quantity}</p>
                <p style={styles.subtotal}>Subtotal: ₹{item.price * item.quantity}</p>
              </div>
              <button
                style={styles.removeBtn}
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Total Price</span>
            <span>₹{totalPrice}</span>
          </div>
          <button style={styles.checkoutBtn} onClick={handleCheckout}>
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/" style={styles.continueBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
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
  layout: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  itemsList: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  info: {
    flex: 1,
  },
  name: {
    margin: '0 0 8px 0',
    color: '#1a1a2e',
  },
  price: {
    margin: '0 0 5px 0',
    color: '#555',
  },
  subtotal: {
    margin: 0,
    fontWeight: 'bold',
    color: '#e94560',
  },
  removeBtn: {
    padding: '8px 16px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  summary: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: '20px',
  },
  summaryTitle: {
    color: '#1a1a2e',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f5f5f5',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    fontSize: '16px',
    color: '#555',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
    marginBottom: '10px',
  },
  continueBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
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
};

export default Cart;