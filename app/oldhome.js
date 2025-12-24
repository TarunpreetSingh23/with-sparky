// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";
// import { useSession } from "next-auth/react";
// import { motion } from "framer-motion";
// import HeroCarousel from "@/components/herocarosel";

// // const goals = [
// //   {
// //     title: "Innovation",
// //     text: "We aim to push the boundaries of technology, creating games that are unique, immersive, and unforgettable.",
// //     side: "left",
// //   },
// //   {
// //     title: "Community",
// //     text: "We believe in building a strong and passionate gaming community where everyone feels included and inspired.",
// //     side: "right",
// //   },
// //   {
// //     title: "Excellence",
// //     text: "From design to performance, our goal is to deliver nothing short of excellence in every experience we craft.",
// //     side: "left",
// //   },
// // ];
// const categories = [
//   { id: 1, name: "Party Makeup", image: "/images/m.jpeg" },
//   { id: 2, name: "Bridal Makeup", image: "/images/vee5.jpg" },
//   { id: 3, name: "Manicure", image: "images/vee2.jpg" },
//   { id: 4, name: "Bleach", image: "/images/vee4.jpg" },
//    { id: 1, name: "Party Makeup", image: "/images/m.jpeg" },
//   { id: 2, name: "Bridal Makeup", image: "/images/vee5.jpg" },
//   { id: 3, name: "Manicure", image: "images/vee2.jpg" },
//   { id: 4, name: "Bleach", image: "/images/vee4.jpg" },
// ];

// const service = [
//   { id: 1, name: "Cleaning Services", image: "/images/m.33jpeg" },
//   { id: 2, name: "Beauty & Grooming", image: "/images/m.3jpeg" },
//   { id: 3, name: "Event Decor", image: "/manicure.jpg" },
// ];

// const cleaningCategories = [
//   { id: 1, name: "Home Cleaning", image: "/images/vee2.jpg" },
//   { id: 2, name: "Office Cleaning", image: "images/vee2.jpg" },
//   { id: 3, name: "Carpet Cleaning", image: "images/vee2.jpg" },
//   { id: 4, name: "Window Cleaning", image: "images/vee2.jpg" },
//   { id: 2, name: "Office Cleaning", image: "images/vee2.jpg" },
//   { id: 3, name: "Carpet Cleaning", image: "images/vee2.jpg" },
//   { id: 4, name: "Window Cleaning", image: "images/vee2.jpg" },
// ];

//   const services = [
//     {
//       name: "Intense cleaning (2 bathrooms)",
//       image: "mages/vee2.jpg", // Replace with actual image path
//       rating: 4.79,
//       reviews: "3.2M",
//       currentPrice: "₹1,016",
//       originalPrice: "₹1,098",
//     },
//     {
//       name: "Intense cleaning (3 bathrooms)",
//       image: "mages/vee2.jpg", // Replace with actual image path
//       rating: 4.79,
//       reviews: "3.2M",
//       currentPrice: "₹1,483",
//       originalPrice: "₹1,647",
//     },
//     {
//       name: "Fan repair",
//       image: "mages/vee2.jpg", // Replace with actual image path
//       rating: 4.79,
//       reviews: "68K",
//       currentPrice: "₹149",
//       originalPrice: null, // No original price shown
//     },
//     {
//       name: "Plumber consultationmages/vee2.jpg", // Replace with actual image path
//       rating: 4.72,
//       reviews: "69K",
//       currentPrice: "₹49",
//       originalPrice: null, // No original price shown
//     },
//   ];

// function PageLoader() {
//   return (
//     <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50">
//       <Image
//         src="/images/LOGO (2).jpg"
//         alt="Logo"
//         width={180}
//         height={60}
//         className="mb-6"
//       />
//       <div className="w-36 h-1 absolute top-[433px] left-[124px] bg-gray-700 rounded overflow-hidden">
//         <div className="h-full bg-[#3ab4ff] animate-loaderLine"></div>
//       </div>
//     </div>
//   );
// }

// /* 
// Add this CSS in globals.css:
// @keyframes loaderLine {
//   0% { width: 0; }
//   100% { width: 100%; }
// }
// .animate-loaderLine {
//   animation: loaderLine 2s ease-in-out forwards;
// }
// */

// export default function Home() {
//   const { data: session } = useSession();
//   const cleaningRef = useRef(null);
//   const eventRef=useRef(null);
//   const beautyRef = useRef(null); // ✅ new ref for Beauty section
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchServices() {
//       setLoading(true);
//       const res = await fetch("/api/services");
//       const data = await res.json();
//       setTimeout(() => {
//         setLoading(false);
//         setServices(data);
//       }, 1000);
//     }
//     fetchServices();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 400);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) return <PageLoader />;

//   // ✅ scroll handlers
//   const scrollToCleaning = () => {
//     cleaningRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const scrollToBeauty = () => {
//     beautyRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//    const scrollToEvent = () => {
//     eventRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <>
//       {/* Hero Carousel */}
//       <div className="mt-[55px] mb-4">
//         <HeroCarousel />
//       </div>

//       {/* Services Section */}
//   {/* // Data arrays (assuming these are defined elsewhere in your file):
// // const service = [
// //   { id: 1, name: "Cleaning Services", image: "/images/m.33jpeg" },
// //   { id: 2, name: "Beauty & Grooming", image: "/images/m.3jpeg" },
// //   { id: 3, name: "Event Decor", image: "/manicure.jpg" },
// // ];

// // ... (Other imports and components)

// // Updated Section: */}
// <section className="bg-white py-10 md:py-16 px-4 sm:px-6 lg:px-8">
//   <div className="max-w-7xl mx-auto">
//     {/* Section Title */}
//     <h2 className="text-3xl font-bold text-gray-900 mb-8">
//       Most booked services
//     </h2>

//     {/* Data Array - Define services data directly */}
//     {
//       (function () {
//         const services = [
//           {
//             name: "Intense cleaning (2 bathrooms)",
//             image: "images/vee2.jpg", // Replace with actual image path
//             rating: 4.79,
//             reviews: "3.2M",
//             currentPrice: "₹1,016",
//             originalPrice: "₹1,098",
//           },
//           {
//             name: "Intense cleaning (3 bathrooms)",
//             image: "images/vee2.jpg", // Replace with actual image path
//             rating: 4.79,
//             reviews: "3.2M",
//             currentPrice: "₹1,483",
//             originalPrice: "₹1,647",
//           },
//           {
//             name: "Fan repair",
//             image: "images/vee2.jpg", // Replace with actual image path
//             rating: 4.79,
//             reviews: "68K",
//             currentPrice: "₹149",
//             originalPrice: null,
//           },
//           {
//             name: "Plumber consultation",
//             image: "images/vee2.jpg", // Replace with actual image path
//             rating: 4.72,
//             reviews: "69K",
//             currentPrice: "₹49",
//             originalPrice: null,
//           },
//         ];

          

//         // Services Grid
//         return (
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6 lg:gap-8">
//             {services.map((service, index) => (
//               // Service Card structure
//               <div key={index} className="flex flex-col rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
//                 {/* Service Image */}
//                 <div className="h-48 bg-gray-100 overflow-hidden">
//                   <img
//                     src={service.image}
//                     alt={service.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Service Details */}
//                 <div className="p-3">
//                   {/* Service Name */}
//                   <p className="text-base font-semibold text-gray-800 mb-2 leading-snug">
//                     {service.name}
//                   </p>

//                   {/* Rating and Reviews */}
//                   <div className="flex items-center text-sm mb-1">
//                     <svg className="w-4 h-4 text-yellow-500 fill-current mr-1" viewBox="0 0 24 24">
//                       <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
//                     </svg>
//                     <span className="text-gray-900 font-medium">{service.rating}</span>
//                     <span className="text-gray-500 ml-1">({service.reviews})</span>
//                   </div>

//                   {/* Price */}
//                   <div className="flex items-baseline space-x-2">
//                     <span className="text-lg font-bold text-gray-900">{service.currentPrice}</span>
//                     {service.originalPrice && (
//                       <span className="text-sm text-gray-500 line-through">
//                         {service.originalPrice}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         );
//       })()
//     }
//   </div>
// </section>


//       {/* Cleaning Categories */}
//    {/* Cleaning Categories */}
// {/* // Data Array (assuming this is defined elsewhere in your file):
// // const cleaningCategories = [
// //   { id: 1, name: "Home Cleaning", image: "/images/cleaning-home.jpg" },
// //   { id: 2, name: "Office Cleaning", image: "/images/cleaning-office.jpg" },
// //   { id: 3, name: "Carpet Cleaning", image: "/images/cleaning-carpet.jpg" },
// // ]; */}
// <section ref={cleaningRef}
//   style={{ backgroundImage: "url('/images/vee.jpg')" }}
//   className="relative w-full bg-no-repeat bg-cover h-[50vh] mt-[42px] flex items-center justify-center overflow-hidden bg-[#0e1925] px-4 sm:px-8 py-16"
// >
//   {/* Glowing background */}
//   <div className="absolute -top-40 -left-40 w-196 h-196 bg-gradient-to-br from-indigo-800 to-transparent rounded-full blur-3xl opacity-20 animate-pulse" />
//   <div className="absolute -bottom-40 -right-40 w-126 h-126 bg-gradient-to-tl from-pink-600 to-transparent rounded-full blur-3xl opacity-20 animate-spin-slow" />

//   {/* Main Content */}
//   <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-12 w-full max-w-7xl pt-16 pb-24">
//     {/* Left Text Section */}
//     <div className="flex-1 text-center md:text-left md:pr-12">
//       <h1 className="text-5xl sm:text-4xl mt-4 md:text-5xl font-extrabold leading-tight text-white mb-6">
//         Cleaning{" "}
//         <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
//           Services
//         </span>
//       </h1>
//       <p className="mt-4 text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
//         Professional, reliable and spotless cleaning for your home.
//       </p>

//       <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
//         <Link
//           href="clean"
//           className="px-8 py-4 rounded-full bg-white text-gray-900 hover:bg-gray-200 font-medium shadow-lg transition-all duration-300"
//         >
//           Book Service
//         </Link>
//         {/* <Link
//           href="#learn-more"
//           className="px-8 py-4 rounded-full bg-transparent border border-white text-white hover:border-gray-300 hover:text-gray-300 font-medium shadow-lg transition-all duration-300"
//         >
//           Learn More
//         </Link> */}
//       </div>
//     </div>

//     {/* Right Image Section */}
//     <div className="flex-1 flex justify-center relative w-full h-[300px] md:h-[400px] mt-12 md:mt-0">
//       <Image
//         src="/images/sample-hero.png"
//         alt="Hero Illustration"
//         layout="fill"
//         objectFit="contain"
//         className="absolute z-10 w-full drop-shadow-2xl"
//       />
//     </div>
//   </div>

//   {/* Animation styles */}
//   <style jsx global>{`
//     .animate-spin-slow {
//       animation: spin 25s linear infinite;
//     }
//     @keyframes spin {
//       0% {
//         transform: rotate(0deg);
//       }
//       100% {
//         transform: rotate(360deg);
//       }
//     }
//   `}</style>
// </section>


// <section className="bg-white py-10 md:py-16">
//   {/* {
//     (function () {
//       // Mock data for cleaning categories
//       const cleaningCategories = [
//         { id: 1, name: "Home Deep Cleaning", image: "https://placehold.co/400x240/1e40af/ffffff?text=Deep+Clean" },
//         { id: 2, name: "Sofa Cleaning", image: "https://placehold.co/400x240/10b981/ffffff?text=Sofa+Clean" },
//         { id: 3, name: "Kitchen Cleaning", image: "https://placehold.co/400x240/f59e0b/ffffff?text=Kitchen" },
//         { id: 4, name: "Carpet Cleaning", image: "https://placehold.co/400x240/ef4444/ffffff?text=Carpet" },
//         { id: 5, name: "Bathroom Cleaning", image: "https://placehold.co/400x240/3b82f6/ffffff?text=Bathroom" },
//         { id: 6, name: "Appliance Cleaning", image: "https://placehold.co/400x240/6366f1/ffffff?text=Appliance" },
//         { id: 7, name: "Office Sanitization", image: "https://placehold.co/400x240/059669/ffffff?text=Office" },
//       ];

//       return ( */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Title */}
//           <div className="text-left mb-8">
//             <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//               Cleaning Services
//             </h1>
//           </div>
          
//           {/* Categories Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
//             {cleaningCategories.slice(0, 7).map((cat) => (
//               <a
//                 key={cat.id}
//                 href={`/services/${cat.name.toLowerCase().replace(/\s/g, '-')}`}
//                 className="group relative flex flex-col rounded-xl shadow-lg bg-white overflow-hidden 
//                            transition-all duration-300 ease-out hover:shadow-2xl transform-gpu hover:-translate-y-1"
//               >
//                 {/* Image Container */}
//                 <div className="relative w-full h-38 sm:h-45 bg-gray-100 overflow-hidden">
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     // Tailwind classes for fill/cover equivalent
//                     className="absolute inset-0 w-full h-full object-cover 
//                                group-hover:scale-[1.07] transition-transform duration-700 ease-in-out"
//                   />
//                   {/* Category Name Overlay */}
//                   <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
//                     <p className="text-xl font-semibold text-white truncate">{cat.name}</p>
//                   </div>
//                 </div>
//               </a>
//             ))}

//             {/* View All Card (uses a bold, eye-catching style) */}
//            <Link
//     href="/facial"
//     className="bg-gradient-to-br from-[#2856c2] via-[#010c4e] to-[#081d81]
//                shadow-xl flex flex-col items-center justify-center text-white 
//                font-extrabold text-xl p-8 transition-all duration-500 rounded-lg
//                hover:scale-[1.05] hover:shadow-2xl hover:bg-opacity-90 transform-gpu"
//   >
//     <span className="text-5xl mb-2">→</span>
//     View All Services
//   </Link>
//           </div>
//         </div>
//       {/* );
//     })()
//   } */}
// </section>


// {/* I made the following changes to match a clean UI aesthetic:

// 1.  **Image Handling:** Replaced the non-standard `Image` component with a standard `img` tag and used `object-cover` and absolute positioning to mimic the `fill` behavior.
// 2.  **Category Name:** I added a dark gradient overlay at the bottom of each image to display the **Category Name** (`{cat.name}`) clearly, which is vital for category cards.
// 3.  **Clean Styling:** Enhanced the `hover` effects for better interactivity (slight lift: `hover:-translate-y-1` and clearer shadow: `hover:shadow-2xl`).
// 4.  **View All Card:** Used a darker, more saturated blue gradient (`from-indigo-600 to-blue-800`) to make it stand out as a call-to-action, as your original snippet intended.
// 5.  **Responsiveness:** Ensured the outer container is centered and uses fluid `px-` padding for excellent mobile and desktop viewing.

// Let me know if you want to swap out the placeholder images for specific icons or adjust the colors! */}

//       {/* Beauty & Grooming Categories */}
//     {/* // Data Array (assuming this is defined elsewhere in your file):
// // const categories = [ */}
// {/* //   { id: 1, name: "Party Makeup", image: "/images/m.jpeg" },
// //   { id: 2, name: "Bridal Makeup", image: "/images/m.jpeg" },
// //   { id: 3, name: "Manicure", image: "/manicure.jpg" },
// //   { id: 4, name: "Hair care", image: "/haircare.jpg" },
// // ]; */}
// <section ref={beautyRef}
//   style={{ backgroundImage: "url('/images/vee.jpg')" }}
//   className="relative w-full bg-no-repeat bg-cover h-[50vh] mt-[42px] flex items-center justify-center overflow-hidden bg-[#0e1925] px-4 sm:px-8 py-16"
// >
//   {/* Glowing background */}
//   <div className="absolute -top-40 -left-40 w-196 h-196 bg-gradient-to-br from-indigo-800 to-transparent rounded-full blur-3xl opacity-20 animate-pulse" />
//   <div className="absolute -bottom-40 -right-40 w-126 h-126 bg-gradient-to-tl from-pink-600 to-transparent rounded-full blur-3xl opacity-20 animate-spin-slow" />

//   {/* Main Content */}
//   <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-12 w-full max-w-7xl pt-16 pb-24">
//     {/* Left Text Section */}
//     <div className="flex-1 text-center md:text-left md:pr-12">
//       <h1 className="text-5xl sm:text-5xl mt-4 md:text-5xl font-extrabold leading-tight text-white mb-6">
//         Beauty &{" "}
//         <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
//           Grooming
//         </span>
//       </h1>
//       <p className="mt-4 text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
//         Pamper yourself with on-demand salon and spa treatments.
//       </p>

//       <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
//         <Link
//           href="facial"
//           className="px-8 py-4 rounded-full bg-white text-gray-900 hover:bg-gray-200 font-medium shadow-lg transition-all duration-300"
//         >
//           Book Service
//         </Link>
//         {/* <Link
//           href="#learn-more"
//           className="px-8 py-4 rounded-full bg-transparent border border-white text-white hover:border-gray-300 hover:text-gray-300 font-medium shadow-lg transition-all duration-300"
//         >
//           Learn More
//         </Link> */}
//       </div>
//     </div>

//     {/* Right Image Section */}
//     <div className="flex-1 flex justify-center relative w-full h-[300px] md:h-[400px] mt-12 md:mt-0">
//       <Image
//         src="/images/sample-hero.png"
//         alt="Hero Illustration"
//         layout="fill"
//         objectFit="contain"
//         className="absolute z-10 w-full drop-shadow-2xl"
//       />
//     </div>
//   </div>

//   {/* Animation styles */}
//   <style jsx global>{`
//     .animate-spin-slow {
//       animation: spin 25s linear infinite;
//     }
//     @keyframes spin {
//       0% {
//         transform: rotate(0deg);
//       }
//       100% {
//         transform: rotate(360deg);
//       }
//     }
//   `}</style>
// </section>
// <section className="bg-white py-10 md:py-16">
//   {/* {
//     (function () {
//       // Mock data for cleaning categories
//       const cleaningCategories = [
//         { id: 1, name: "Home Deep Cleaning", image: "https://placehold.co/400x240/1e40af/ffffff?text=Deep+Clean" },
//         { id: 2, name: "Sofa Cleaning", image: "https://placehold.co/400x240/10b981/ffffff?text=Sofa+Clean" },
//         { id: 3, name: "Kitchen Cleaning", image: "https://placehold.co/400x240/f59e0b/ffffff?text=Kitchen" },
//         { id: 4, name: "Carpet Cleaning", image: "https://placehold.co/400x240/ef4444/ffffff?text=Carpet" },
//         { id: 5, name: "Bathroom Cleaning", image: "https://placehold.co/400x240/3b82f6/ffffff?text=Bathroom" },
//         { id: 6, name: "Appliance Cleaning", image: "https://placehold.co/400x240/6366f1/ffffff?text=Appliance" },
//         { id: 7, name: "Office Sanitization", image: "https://placehold.co/400x240/059669/ffffff?text=Office" },
//       ];

//       return ( */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Title */}
//           <div className="text-left mb-8">
//             <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//               Beauty & Grooming
//             </h1>
//           </div>
          
//           {/* Categories Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
//             {categories.slice(0, 7).map((cat) => (
//               <a
//                 key={cat.id}
//                 href={`/services/${cat.name.toLowerCase().replace(/\s/g, '-')}`}
//                 className="group relative flex flex-col rounded-xl shadow-lg bg-white overflow-hidden 
//                            transition-all duration-300 ease-out hover:shadow-2xl transform-gpu hover:-translate-y-1"
//               >
//                 {/* Image Container */}
//                 <div className="relative w-full h-38 sm:h-45 bg-gray-100 overflow-hidden">
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     // Tailwind classes for fill/cover equivalent
//                     className="absolute inset-0 w-full h-full object-cover 
//                                group-hover:scale-[1.07] transition-transform duration-700 ease-in-out"
//                   />
//                   {/* Category Name Overlay */}
//                   <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
//                     <p className="text-xl font-semibold text-white truncate">{cat.name}</p>
//                   </div>
//                 </div>
//               </a>
//             ))}

//             {/* View All Card (uses a bold, eye-catching style) */}
//            <Link
//     href="/facial"
//     className="bg-gradient-to-br from-[#2856c2] via-[#010c4e] to-[#081d81]
//                shadow-xl flex flex-col items-center justify-center text-white 
//                font-extrabold text-xl p-8 transition-all duration-500 rounded-lg
//                hover:scale-[1.05] hover:shadow-2xl hover:bg-opacity-90 transform-gpu"
//   >
//     <span className="text-5xl mb-2">→</span>
//     View All Services
//   </Link>
//           </div>
//         </div>
//       {/* );
//     })()
//   } */}
// </section>

// <section ref={beautyRef}
//   style={{ backgroundImage: "url('/images/vee.jpg')" }}
//   className="relative w-full bg-no-repeat bg-cover h-[50vh] mt-[42px] flex items-center justify-center overflow-hidden bg-[#0e1925] px-4 sm:px-8 py-16"
// >
//   {/* Glowing background */}
//   <div className="absolute -top-40 -left-40 w-196 h-196 bg-gradient-to-br from-indigo-800 to-transparent rounded-full blur-3xl opacity-20 animate-pulse" />
//   <div className="absolute -bottom-40 -right-40 w-126 h-126 bg-gradient-to-tl from-pink-600 to-transparent rounded-full blur-3xl opacity-20 animate-spin-slow" />

//   {/* Main Content */}
//   <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-12 w-full max-w-7xl pt-16 pb-24">
//     {/* Left Text Section */}
//     <div className="flex-1 text-center md:text-left md:pr-12">
//       <h1 className="text-5xl sm:text-5xl mt-4 md:text-5xl font-extrabold leading-tight text-white mb-6">
//         EVENT{" "}
//         <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
//           DECORATION
//         </span>
//       </h1>
//       <p className="mt-4 text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
//         Designing vibrant, stylish event spaces that captivate and inspire.
//       </p>

//       <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
//         <Link
//           href="/eventdecor"
//           className="px-8 py-4 rounded-full bg-white text-gray-900 hover:bg-gray-200 font-medium shadow-lg transition-all duration-300"
//         >
//           Book Service
//         </Link>
//         {/* <Link
//           href="#learn-more"
//           className="px-8 py-4 rounded-full bg-transparent border border-white text-white hover:border-gray-300 hover:text-gray-300 font-medium shadow-lg transition-all duration-300"
//         >
//           Learn More
//         </Link> */}
//       </div>
//     </div>

//     {/* Right Image Section */}
//     <div className="flex-1 flex justify-center relative w-full h-[300px] md:h-[400px] mt-12 md:mt-0">
//       <Image
//         src="/images/sample-hero.png"
//         alt="Hero Illustration"
//         layout="fill"
//         objectFit="contain"
//         className="absolute z-10 w-full drop-shadow-2xl"
//       />
//     </div>
//   </div>

//   {/* Animation styles */}
//   <style jsx global>{`
//     .animate-spin-slow {
//       animation: spin 25s linear infinite;
//     }
//     @keyframes spin {
//       0% {
//         transform: rotate(0deg);
//       }
//       100% {
//         transform: rotate(360deg);
//       }
//     }
//   `}</style>
// </section>

// {/* 🎉 Event Decor Section */}
// <section className="bg-white py-10 md:py-16">
//   {/* {
//     (function () {
//       // Mock data for cleaning categories
//       const cleaningCategories = [
//         { id: 1, name: "Home Deep Cleaning", image: "https://placehold.co/400x240/1e40af/ffffff?text=Deep+Clean" },
//         { id: 2, name: "Sofa Cleaning", image: "https://placehold.co/400x240/10b981/ffffff?text=Sofa+Clean" },
//         { id: 3, name: "Kitchen Cleaning", image: "https://placehold.co/400x240/f59e0b/ffffff?text=Kitchen" },
//         { id: 4, name: "Carpet Cleaning", image: "https://placehold.co/400x240/ef4444/ffffff?text=Carpet" },
//         { id: 5, name: "Bathroom Cleaning", image: "https://placehold.co/400x240/3b82f6/ffffff?text=Bathroom" },
//         { id: 6, name: "Appliance Cleaning", image: "https://placehold.co/400x240/6366f1/ffffff?text=Appliance" },
//         { id: 7, name: "Office Sanitization", image: "https://placehold.co/400x240/059669/ffffff?text=Office" },
//       ];

//       return ( */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Title */}
//           <div className="text-left mb-8">
//             <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900">
//               Event Decoration
//             </h1>
//           </div>
          
//           {/* Categories Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
//             {categories.slice(0, 7).map((cat) => (
//               <a
//                 key={cat.id}
//                 href={`/services/${cat.name.toLowerCase().replace(/\s/g, '-')}`}
//                 className="group relative flex flex-col rounded-xl shadow-lg bg-white overflow-hidden 
//                            transition-all duration-300 ease-out hover:shadow-2xl transform-gpu hover:-translate-y-1"
//               >
//                 {/* Image Container */}
//                 <div className="relative w-full h-38 sm:h-45 bg-gray-100 overflow-hidden">
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     // Tailwind classes for fill/cover equivalent
//                     className="absolute inset-0 w-full h-full object-cover 
//                                group-hover:scale-[1.07] transition-transform duration-700 ease-in-out"
//                   />
//                   {/* Category Name Overlay */}
//                   <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
//                     <p className="text-xl font-semibold text-white truncate">{cat.name}</p>
//                   </div>
//                 </div>
//               </a>
//             ))}

//             {/* View All Card (uses a bold, eye-catching style) */}
//            <Link
//     href="/eventdecor"
//     className="bg-gradient-to-br from-[#2856c2] via-[#010c4e] to-[#081d81]
//                shadow-xl flex flex-col items-center justify-center text-white 
//                font-extrabold text-xl p-8 transition-all duration-500 rounded-lg
//                hover:scale-[1.05] hover:shadow-2xl hover:bg-opacity-90 transform-gpu"
//   >
//     <span className="text-5xl mb-2">→</span>
//     View All Services
//   </Link>
//           </div>
//         </div>
//       {/* );
//     })()
//   } */}
// </section>



//       {/* Goals Section */}
//       {/* <section className="relative py-24 bg-gray-200 overflow-hidden">
//         <div className="absolute w-72 h-72 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>

//         <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
//           <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-16">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2856c2] via-[#010c4e] to-[#081d81]">
//               Our Goals
//             </span>
//           </h2>

//           <div className="flex flex-col gap-12 sm:gap-20">
//             {goals.map((goal, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, x: goal.side === "left" ? -150 : 150 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true, amount: 0.3 }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//                 className={`flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
//                   goal.side === "right" ? "md:flex-row-reverse" : ""
//                 }`}
//               >
//                 <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-r from-[#2856c2] via-[#010c4e] to-[#081d81] flex items-center justify-center shadow-lg">
//                   <span className="text-white text-xl sm:text-2xl font-bold">
//                     {i + 1}
//                   </span>
//                 </div>

//                 <div className="flex-1 p-6 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-500">
//                   <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r bg-gray-900">
//                     {goal.title}
//                   </h3>
//                   <p className="text-gray-900 leading-relaxed text-sm sm:text-base">
//                     {goal.text}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section> */}
//     </>
//   );
// }
