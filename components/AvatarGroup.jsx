'use client';
export default function AvatarGroup({ count = 3 }) {
  return (
    <div className="flex -space-x-2">
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} className="w-7 h-7 rounded-full ring-2 ring-white bg-slate-300 flex items-center justify-center text-xs"> {(i+1)} </div>
      ))}
      <div className="w-7 h-7 rounded-full ring-2 ring-white bg-slate-100 text-slate-600 flex items-center justify-center text-xs">+3</div>
    </div>
  );
}
