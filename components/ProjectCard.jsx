'use client';
import Link from 'next/link';
export default function ProjectCard({ title, status, href }) {
  return (
    <Link href={href} className="card hover:shadow transition block">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-brand text-sm">{status}</span>
        <span className="text-xl">→</span>
      </div>
    </Link>
  );
}
