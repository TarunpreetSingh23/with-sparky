'use client'; // if using App Router

import toast from 'react-hot-toast';

export default function MyComponent() {
  const handleClick = () => {
    toast.success('Item added to cart!');
    // or toast.error('Something went wrong!')
  };

  return (
    <button onClick={handleClick} className="px-4 py-2 bg-blue-500 text-white">
      Show Toast
    </button>
  );
}