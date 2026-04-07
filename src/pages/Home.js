import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://myshop-backend-x6fu.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ padding: '40px' }}>Loading products...</h2>;
  if (error) return <h2 style={{ padding: '40px' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>All Products</h1>
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '25px',
  },
};

export default Home;