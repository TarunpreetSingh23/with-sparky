// 'use client';
// import { addDays, format } from 'date-fns';
// import { useState } from 'react';

// export default function DateScroller() {
//   const [selected] = useState(new Date());
//   const start = selected;
//   const days = Array.from({length:5}).map((_,i)=> addDays(start, i));
//   return (
//     <div className="px-4 mt-4">
//       <div className="text-sm text-slate-500 mb-2">Select date</div>
//       <div className="flex gap-3">
//         {days.map((d,i)=>{
//           const isSelected = i===0;
//           return (
//             <button key={i} className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 w-14 h-16 ${isSelected? 'bg-brand text-white' : 'bg-slate-100 text-slate-700'}`}>
//               <div className="text-xs">{format(d, 'EEE')}</div>
//               <div className="text-lg font-semibold">{format(d, 'd')}</div>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
