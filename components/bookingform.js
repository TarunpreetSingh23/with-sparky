"use client";
import React, { use, useState } from "react";
import Image from "next/image";
import { connects } from "@/dbconfig/dbconfig";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";



export default function BookForm({ service, onClose }) {
const { data: session } = useSession(); 
  const router=useRouter();
  const [name, setname] = useState("")
  const [address, setaddress] = useState("")
  const [time, settime] = useState("")
  const [date, setdate] = useState("")
  const [phone, setphone] = useState("")
  const [error, seterror] = useState("")
 

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!phone || !name || !address || !date || !time) {
    seterror("All fields are required");
    return;
  }

  try {
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address,
        date,
        time,
        serviceTitle: service.title, 
        email: session?.user?.email
      }),
    });

    if (res.ok) {
      e.target.reset();
      seterror("");
      alert("Booking Confirmed!");
      console.log(session?.user?.email)
      router.push("/")
      
    } else {
      seterror("Booking failed. Try again.");
    }
  } catch (error) {
    console.error(error);
    seterror("Something went wrong!");
  }
};

  return (
    <div className="fixed inset-0 bg-white sm:bg-white/40 backdrop-blur-none sm:backdrop-blur-sm flex justify-center items-center  z-50">
      <div onSubmit={(e)=>{handleSubmit}} className="bg-white  border p-6 rounded-lg shadow-xl mt-[17px] w-[95%] h-[90%] sm:h-[60%] sm:w-[750px] backdrop-blur-none sm:backdrop-blur-lg relative flex flex-col  sm:flex-row gap-6">
        
    
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <div className="flex-1 bg-white/20 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3 text-gray-800">
            Book: {service.title}
          </h2>
          <form onSubmit={(e)=>{handleSubmit(e)}} className="flex flex-col gap-3">
            <input
            onChange={(e)=>{setname(e.target.value)}}
              type="text"
              placeholder="Your Name"
              className="border p-2 rounded"
            />
            <input
             onChange={(e)=>{setphone(e.target.value)}}
              type="text"
              placeholder="Phone Number"
              className="border p-2 rounded"
            />
            <input
             onChange={(e)=>{setaddress(e.target.value)}}
              type="text"
              placeholder="Address"
              className="border p-2 rounded"
            />
            <label htmlFor="date">Date</label>
            <input  onChange={(e)=>{setdate(e.target.value)}} type="date" name="date" id="date" className="border p-2 rounded" />
            <label htmlFor="time" >Time</label>
            <input   onChange={(e)=>{settime(e.target.value)}} type="time" name="time" id="time" className="border p-2 rounded" />
            <button
           
              type="submit"
              className="bg-gradient-to-r from-[#1e263b] to-[#3a3954] text-white py-2 rounded hover:bg-gradient-to-l"
            >
              Confirm Booking
            </button>
          {error&&( <div className="text-white bg-red p-3 w-fit ">
              {error};


            </div>)}
          </form>
        </div>

   
        <div className="flex-1 flex flex-col items-center  text-center bg-white/20 p-4 rounded-lg">
          <div className="relative w-20px h-30px sm:w-full sm:h-48 rounded-lg overflow-hidden mb-3">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
          <p className="text-gray-700 text-sm mt-1">{service.description}</p>
          <p className="text-[#1e263b] font-semibold text-base mt-2">
            ₹ {service.price}
          </p>
        </div>
      </div>
    </div>
  );
}
