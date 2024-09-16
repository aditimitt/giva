// pages/index.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Product from '../components/Product';

const IndexPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to the Store</h1>
      {products.length > 0 ? <Product products={products} /> : <p>Loading products...</p>}
    </div>
  );
};

export default IndexPage;
