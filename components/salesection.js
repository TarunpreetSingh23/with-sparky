'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';


export default function SaleSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
<Link href={"/boat"}>

    <div className="w-full flex justify-center items-center  min-h-[300px]" ref={ref}>
      <div className="relative w-full max-w-7xl h-80 overflow-hidden bg-gray-100 rounded-lg shadow-xl">
     
        <motion.div
          initial={{ x: 0 }}
          animate={inView ? { x: '-100%' } : {}}
          transition={{ duration: 1.2 }}
          className="absolute left-0 top-0 w-1/2 h-full bg-[#20232a] z-10"
        />
    
        <motion.div
          initial={{ x: 0 }}
          animate={inView ? { x: '100%' } : {}}
          transition={{ duration: 1.2 }}
          className="absolute right-0 top-0 w-1/2 h-full bg-[#20232a] z-10"
        />

       
        <Image
          src="/images/Untitled design.png" 
          alt="Sale"
          fill
          className="object-cover"
        />
      </div>
    </div>
</Link>
  );
}
