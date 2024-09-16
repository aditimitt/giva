import Link from 'next/link';
import { useSelector } from 'react-redux';

const Header = () => {
  // Ensure `cartItems` is always defined, defaulting to an empty array if undefined
  const cartItems = useSelector(state => state.cart.cartItems || []);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); // Calculate total quantity

  return (
    <header className="p-4 bg-gray-100 border-b border-gray-200">
      <nav className="flex justify-between items-center">
        <div className="flex items-center space-x-4"> {/* Flex container for left items */}
          <Link href="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </div>
        <div className="relative flex items-center"> {/* Flex container for right items */}
          <Link href="/cart" className="flex items-center">
            <span className="material-icons text-blue-500">Shopping Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs">
                {totalItems} 
              </span>
            )}
          </Link>
        </div>
      </nav>
      <style jsx>{`
        .material-icons {
          font-family: 'Material Icons';
          margin-right: 1.5rem; 
        }
      `}</style>
    </header>
  );
};

export default Header;
