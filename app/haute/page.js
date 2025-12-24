"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CheckCircle, X, ShoppingCart, Filter, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// --- Loader Component (Kept clean) ---
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50">
      <Image
        src="/images/LOGO (2).jpg"
        alt="Logo"
        width={180}
        height={60}
        className="mb-6"
      />
      {/* Centered loader bar */}
      <div className="w-48 h-1 bg-gray-700 rounded overflow-hidden">
        <div className="h-full bg-[#3ab4ff] animate-loaderLine"></div>
      </div>
    </div>
  );
}

const renderSteps = (stepsArray) => {
    if (!Array.isArray(stepsArray) || stepsArray.length === 0) {
        return (
            <div className="bg-white p-4 rounded-xl border border-gray-200 mt-4">
                <p className="text-gray-500 italic text-sm">No step-by-step process is available for this service.</p>
            </div>
        );
    }

    return (
        // Changed bg-gray-50 to white, added soft shadow for definition
        <div className="mt-6 p-5 border border-gray-200 rounded-2xl bg-white shadow-inner">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                Service Procedure
            </h4>
            <ol className="pl-0 space-y-4 text-gray-700">
                {stepsArray.map((step, index) => {
                    const parts = step.split('—');
                    const heading = parts[0].trim();
                    const detail = parts.slice(1).join('—').trim();

                    return (
                        <li key={index} className="flex items-start">
                            {/* Custom Step Number styling */}
                            <div className="flex-shrink-0 w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-[#002366] text-white font-extrabold text-sm shadow-md">
                                {index + 1}
                            </div>
                            <div className="flex-grow">
                                {/* Enhanced Heading readability */}
                                <p className="font-extrabold text-lg text-[#002366] leading-snug">
                                    {heading}
                                </p>
                                {/* Detail text with better visual weight */}
                                {detail && <p className="text-base text-gray-700 mt-0.5">{detail}</p>}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

// --- Main Component ---
export default function CleaningPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  // --- Data Fetching and Initialization ---
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // NOTE: Keeping the /facial endpoint as per your code
        const res = await fetch("/api/services/facial");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  // --- Cart Management Functions ---
  const removeFromCart = (id) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Find the index of the first item with this ID
    const indexToRemove = existingCart.findIndex(item => item._id === id);
    
    if (indexToRemove > -1) {
      existingCart.splice(indexToRemove, 1); // Remove only one instance
    }
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);

    toast.error(
      <div className="flex items-center gap-3">
        <X className="text-white w-5 h-5" />
        <span className="text-white font-medium">Item removed from cart ❌</span>
      </div>,
      {
        style: {
          background: "linear-gradient(to right, #ef4444, #b91c1c)",
          color: "#fff",
          borderRadius: "12px",
          padding: "12px 18px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        },
        icon: null,
        duration: 3000,
      }
    );
  };

  const successToast = () => {
    toast.success(
      <div className="flex items-center gap-3">
        <CheckCircle className="text-white w-5 h-5" />
        <span className="text-white font-medium">Item added to cart ✅</span>
      </div>,
      {
        style: {
          background: "linear-gradient(to right, #4ade80, #16a34a)",
          color: "#fff",
          borderRadius: "12px",
          padding: "12px 18px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        },
        icon: null,
        duration: 3000,
      }
    );
  };

  const addToCart = (newItem) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (existingCart.length > 0) {
      const existingCategory = existingCart[0].category;
      if (existingCategory !== newItem.category) {
        const confirmReplace = window.confirm(
          "Your cart already contains services from a different category. Replace it?"
        );
        if (confirmReplace) {
          existingCart = [{ ...newItem, quantity: 1 }];
          localStorage.setItem("cart", JSON.stringify(existingCart));
          setCart(existingCart);
          toast.success("Cart replaced!");
        } else return;
      } else {
        const itemIndex = existingCart.findIndex(
          (item) => item._id === newItem._id
        );
        if (itemIndex > -1) existingCart[itemIndex].quantity += 1;
        else existingCart.push({ ...newItem, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(existingCart));
        setCart(existingCart);
        successToast();
      }
    } else {
      existingCart.push({ ...newItem, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(existingCart));
      setCart(existingCart);
      successToast();
    }
  };
  
  // --- Computed Values ---
  const filteredServices =
    selectedCategory === "ALL"
      ? services
      : services.filter((s) =>
          s.title.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const totalCartItems = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  
  // Group cart items for display (if multiple items of same ID exist)
  const cartItemGroups = cart.reduce((acc, item) => {
    if (!acc[item._id]) {
        acc[item._id] = { ...item, quantity: 0 };
    }
    acc[item._id].quantity += 1;
    return acc;
  }, {});
  const groupedCart = Object.values(cartItemGroups);

  // --- Render ---
  return (
    <div className="mt-[70px] bg-gray-50 min-h-screen">
      
      {/* 🔹 TOP FILTER BAR */}
      <div className="sticky top-[70px] bg-white z-40 shadow-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-3 justify-center">
          {["ALL", "FACIAL", "MANICURE", "PEDICURE", "CLEANSING", "WAXING", "BLEACH", "MAKEUP"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 border ${
                selectedCategory === cat
                  ? "bg-[#002366] text-white border-[#002366] shadow-lg"
                  : "bg-gray-50 hover:bg-gray-200 text-gray-700 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 MAIN SERVICE GRID */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <motion.div
                key={service._id}
                variants={itemVariants}
                className="service-card bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative w-full h-52">
                  <Image
                    src={service.image || "/cleaning-placeholder.png"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  {service.discount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                      {service.discount} OFF
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                  {/* TRUNCATED DESCRIPTION with "..." */}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <span className="text-2xl font-extrabold text-[#002366]">
                      ₹{service.price}
                    </span>
                    <div className="text-sm text-gray-700">
                      <span className="text-yellow-500">⭐</span>{" "}
                      {service.rating?.average || "4.8"}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex items-center justify-center flex-1 border border-[#002366]/50 text-[#002366] py-2 rounded-xl font-medium hover:bg-[#002366]/10 transition-all"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Details
                    </button>
                    <button
                      onClick={() => addToCart(service)}
                      className="flex items-center justify-center flex-1 bg-[#002366] text-white py-2 rounded-xl font-semibold hover:bg-[#4a65d6] transition-all shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center p-10 bg-white rounded-xl shadow-lg">
              No services found in the {selectedCategory.toLowerCase()} category. Please try "ALL".
            </p>
          )}
        </motion.div>
      </main>

      {/* 🔹 FLOATING CART BUTTON */}
      <button
        onClick={() => setCartOpen(!cartOpen)}
        className="fixed bottom-6 right-6 bg-[#002366] text-white p-4 rounded-full shadow-2xl hover:bg-[#4a65d6] transition-all duration-300 z-50"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalCartItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-2 py-0.5 animate-bounce">
            {totalCartItems}
          </span>
        )}
      </button>

      {/* 🔹 SLIDING CART PANEL (ENHANCED WITH REMOVE BUTTON) */}
      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl border-l z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-[#002366] flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" /> Your Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {groupedCart.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                Your cart is empty.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {groupedCart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between bg-gray-50 rounded-xl p-4 shadow-sm border"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {item.quantity}x @ ₹{item.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-green-600">
                        ₹{item.price * (item.quantity || 1)}
                      </span>
                      {/* --- REMOVE BUTTON ADDED HERE --- */}
                      <button 
                        onClick={() => removeFromCart(item._id)} 
                        className="text-red-500 hover:text-red-700 text-xs mt-1 font-semibold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3 h-3"/> Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-800 text-lg">
                      Total:
                    </span>
                    <span className="text-2xl font-extrabold text-[#002366]">
                      ₹{cartTotal}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 🔹 ENHANCED DETAILS MODAL (DYNAMIC CONTENT) */}
     <AnimatePresence>
    {selectedService && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedService(null)}
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="bg-white rounded-3xl shadow-2xl  max-w-2xl relative max-h-[79vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image and Close Button */}
                <div className="relative w-full h-56">
                    <Image
                        src={selectedService.image || "/cleaning-placeholder.png"}
                        alt={selectedService.title}
                        className="w-full h-full rounded-t-3xl object-cover shadow-md"
                    />
                    <button
                        onClick={() => setSelectedService(null)}
                        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {selectedService.title}
                    </h3>

                    {/* DYNAMIC SERVICE DESCRIPTION (Summary) */}
                    <div className="pb-4 border-b border-gray-100 mb-4">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Overview</h4>
                        <p className="text-gray-700 leading-relaxed text-base">
                            {selectedService.description || "The service provider has not provided an extended description. Please refer to the brief summary."}
                        </p>
                    </div>

                    {/* --- RENDER STEPS DYNAMICALLY --- */}
                    {renderSteps(selectedService.steps)}

                    {/* Price and Rating Footer */}
                    <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
                        <div className="flex flex-col">
                            <span className="text-lg text-gray-500 font-medium">Price</span>
                            <span className="text-4xl font-extrabold text-[#002366]">
                                ₹{selectedService.price}
                            </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-700 flex items-center gap-1">
                            <span className="text-yellow-500 text-xl">⭐</span>
                            {selectedService.rating?.average || "4.8"}
                        </div>
                    </div>
                </div>

                {/* Sticky CTA Button (Cleaned up) */}
                <div className="p-6 pt-0 sticky bottom-0 bg-white rounded-b-3xl shadow-top">
                    <button
                        onClick={() => {
                            // Assuming addToCart and setSelectedService(null) functions exist
                            // addToCart(selectedService);
                            // setSelectedService(null); 
                            // Using the real function calls here:
                            addToCart(selectedService);
                            setSelectedService(null);
                        }}
                        className="w-full bg-[#002366] text-white py-3 rounded-xl font-bold hover:bg-[#4a65d6] transition-all shadow-lg text-lg flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>
    </div>
  );
}
