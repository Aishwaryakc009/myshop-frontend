import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoText}>MyShop</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {user ? (
          <>
            <span style={styles.welcome}>Hi, {user.name}!</span>
            <Link to="/myorders" style={styles.link}>My Orders</Link>
            {user && user.isAdmin && (
               <Link to="/admin" style={styles.link}>Admin</Link>
         )}
            <button style={styles.logoutBtn} onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
        <Link to="/cart" style={styles.link}>🛒 Cart ({totalItems})</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#1a1a2e',
    color: 'white',
  },
  logoText: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '25px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
  },
  welcome: {
    color: '#f0c040',
    fontSize: '15px',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;