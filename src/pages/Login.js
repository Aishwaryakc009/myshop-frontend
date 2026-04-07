import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const url = isLogin
      ? 'https://myshop-backend-x6fu.onrender.com/api/auth/login'
      : 'https://myshop-backend-x6fu.onrender.com/api/auth/register';

    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }
      login(data);
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <h2 style={styles.heading}>
          {isLogin ? 'Welcome Back 👋' : 'Create Account 🚀'}
        </h2>

        {error && <p style={styles.error}>{error}</p>}

        {!isLogin && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          style={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            style={styles.switchLink}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  tabs: {
    display: 'flex',
    marginBottom: '25px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
  },
  tab: {
    flex: 1,
    padding: '12px',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#555',
  },
  activeTab: {
    flex: 1,
    padding: '12px',
    border: 'none',
    backgroundColor: '#1a1a2e',
    color: 'white',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  heading: {
    color: '#1a1a2e',
    marginBottom: '25px',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#555',
    fontSize: '14px',
  },
  switchLink: {
    color: '#e94560',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Login;