import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://myshop-backend-x6fu.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [id]);

  const increase = () => { if (quantity < 10) setQuantity(quantity + 1); };
  const decrease = () => { if (quantity > 1) setQuantity(quantity - 1); };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) return <h2 style={{ padding: '40px' }}>Loading...</h2>;
  if (!product) return <h2 style={{ padding: '40px' }}>Product not found!</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.price}>₹{product.price}</p>
          <p style={styles.description}>{product.description}</p>
          <div style={styles.quantityRow}>
            <button style={styles.qtyBtn} onClick={decrease}>−</button>
            <span style={styles.qty}>{quantity}</span>
            <button style={styles.qtyBtn} onClick={increase}>+</button>
          </div>
          <button style={styles.cartBtn} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  card: {
    display: 'flex',
    gap: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 auto',
  },
  image: {
    width: '400px',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: '15px',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '25px',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
  },
  qtyBtn: {
    width: '35px',
    height: '35px',
    fontSize: '20px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  qty: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  cartBtn: {
    padding: '14px 30px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default ProductDetail;