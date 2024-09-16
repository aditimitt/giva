import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartItemQuantity } from '../../redux/cartSlice'; // Ensure you have updateCartItemQuantity action
import { useRouter } from 'next/router';
import axios from 'axios';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(0); // Local state for quantity

  useEffect(() => {
    if (id) {
      axios.get(`https://fakestoreapi.com/products/${id}`)
        .then(response => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Product not found');
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const itemInCart = cart.cartItems.find(item => item.id === product.id);
      if (itemInCart) {
        setQuantity(itemInCart.quantity);
      } else {
        setQuantity(0); // Default quantity if not in cart
      }
    }
  }, [cart.cartItems, product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product.id));
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    dispatch(updateCartItemQuantity({ id: product.id, quantity: 1 }));
  };

  const handleDecrement = () => {
    console.log('quantity',quantity);
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      dispatch(updateCartItemQuantity({ id: product.id, quantity: -1 }));
    } else {
        console.log('yyy');
        setQuantity(0); 
        dispatch(removeFromCart(product.id));
    }
  };

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="mb-4 bg-gray-300 p-2 rounded">
        Back
      </button>
      
      {product && (
        <div className="border p-4 rounded">
          <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-2" />
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-2">${product.price}</p>
          <p className="text-gray-500 mb-2">Category: {product.category}</p>
          <p className="text-yellow-500 mb-2">Rating: {product.rating.rate}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex items-center mt-4">
            {quantity > 0 ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDecrement}
                  className="bg-gray-300 p-2 rounded"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="bg-gray-300 p-2 rounded"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
