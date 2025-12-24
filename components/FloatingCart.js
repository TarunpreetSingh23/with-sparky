'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function FloatingCart() {
  const { cartItems } = useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowCart(!showCart)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer z-50 hover:bg-orange-600"
      >
        🛒
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </div>

      {showCart && (
        <div className="fixed bottom-24 right-6 w-80 max-h-[300px] overflow-y-auto bg-white border shadow-lg rounded-lg z-50 p-4">
          <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-500">Cart is empty</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex justify-between border-b py-2">
                <span>{item.name}</span>
                <span className="font-bold">${item.price.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
