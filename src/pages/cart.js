// src/pages/cart.js
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';

const Cart = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemove = (product) => {
    dispatch(removeFromCart(product));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover" />
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p>${item.price} x {item.quantity}</p>
              </div>
              <button onClick={() => handleRemove(item)} className="bg-red-500 text-white py-1 px-3 rounded">
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
      <h2 className="text-xl font-semibold mt-4">Total: ${totalAmount}</h2>
    </div>
  );
};

export default Cart;
