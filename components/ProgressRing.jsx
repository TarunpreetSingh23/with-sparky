'use client';
export default function ProgressRing({ value }) {
  return (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full" style={{
        background: `conic-gradient(#2F5BFF ${value*3.6}deg, #e6e8ef ${value*3.6}deg)`
      }}></div>
      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center text-sm font-semibold">{value}%</div>
    </div>
  );
}
