import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.price}>₹{product.price}</p>
        <div style={styles.buttons}>
          <Link to={`/product/${product._id}`} style={styles.viewBtn}>
            View Details
          </Link>
          <button
            style={styles.cartBtn}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  info: {
    padding: '15px',
  },
  name: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    color: '#1a1a2e',
  },
  price: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#e94560',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  viewBtn: {
    padding: '8px 12px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '14px',
  },
  cartBtn: {
    padding: '8px 12px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default ProductCard;