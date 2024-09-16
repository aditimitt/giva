import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartItemQuantity } from '../redux/cartSlice';
import axios from 'axios';
import Link from 'next/link';


const ProductList = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort is ascending

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products per page (can be adjusted)

  useEffect(() => {
    // Fetch all products
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(err => console.error('Error fetching products:', err));

    // Fetch categories
    axios.get('https://fakestoreapi.com/products/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Handle filtering by category
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    const filtered = category === '' ? products : products.filter(product => product.category === category);
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  // Handle sorting by price
  const handleSortChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);

    const sorted = [...filteredProducts].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });

    setFilteredProducts(sorted);
    setCurrentPage(1); // Reset to the first page on sort change
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Cart handlers
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleIncrement = (product) => {
    dispatch(updateCartItemQuantity({ id: product.id, quantity: 1 }));
  };

  const handleDecrement = (product) => {
    const productInCart = cart.cartItems.find(item => item.id === product.id);
    if (productInCart && productInCart.quantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(updateCartItemQuantity({ id: product.id, quantity: -1 }));
    }
  };

  const isProductInCart = (id) => {
    return cart.cartItems.some(cartItem => cartItem.id === id);
  };

  const getProductQuantityInCart = (id) => {
    const item = cart.cartItems.find(cartItem => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label className="mr-2">Filter by Category:</label>
          <select value={selectedCategory} onChange={handleCategoryChange} className="p-2 border">
            <option value="">All</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="mr-2">Sort by Price:</label>
          <select value={sortOrder} onChange={handleSortChange} className="p-2 border">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentProducts.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <Link href={`/products/${product.id}`}>
              <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-2" />
            </Link>
            <h1 className="text-lg font-bold">{product.title}</h1>
            <p className="text-gray-600">${product.price}</p>

            <div className="flex items-center mt-2">
              {isProductInCart(product.id) ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecrement(product)}
                    className="bg-gray-300 p-2 rounded"
                  >
                    -
                  </button>
                  <span>{getProductQuantityInCart(product.id)}</span>
                  <button
                    onClick={() => handleIncrement(product)}
                    className="bg-gray-300 p-2 rounded"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <ul className="flex space-x-2">
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <li key={pageNumber + 1}>
              <button
                onClick={() => paginate(pageNumber + 1)}
                className={`px-4 py-2 rounded ${currentPage === pageNumber + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {pageNumber + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
