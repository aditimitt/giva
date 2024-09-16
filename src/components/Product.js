import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartItemQuantity } from '../redux/cartSlice';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 10;

const Product = ({ products }) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.cartItems || []);

  const [currentPage, setCurrentPage] = useState(1);

  const handleIncrement = (product) => {
    dispatch(updateCartItemQuantity({ id: product.id, quantity: 1 }));
  };

  const handleDecrement = (product) => {
    const productInCart = cart.find(item => item.id === product.id);
    if (productInCart && productInCart.quantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(updateCartItemQuantity({ id: product.id, quantity: -1 }));
    }
  };

  const isProductInCart = (id) => {
    return cart.find(cartItem => Number(cartItem.id) === Number(id)) || null;
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedProducts.map((product) => {
          const productInCart = isProductInCart(product.id);

          return (
            <div key={product.id} className="border p-4 rounded">
              <Link href={`/products/${product.id}`}>
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-2 cursor-pointer" />
              </Link>
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600">${product.price}</p>
              <p className="text-gray-500">Category: {product.category}</p>
              <p className="text-yellow-500">Rating: {product.rating.rate}</p>
              
              {!productInCart ? (
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="mt-2 py-1 px-3 bg-blue-500 text-white rounded"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleDecrement(product)}
                    className="py-1 px-3 bg-gray-300 text-white rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{productInCart.quantity}</span>
                  <button
                    onClick={() => handleIncrement(product)}
                    className="py-1 px-3 bg-blue-500 text-white rounded"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 p-2 rounded"
        >
          Previous
        </button>
        <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-300 p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Product;
