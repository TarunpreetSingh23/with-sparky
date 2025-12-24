'use client';
import Link from 'next/link';
import { Home, MessageSquare, CalendarDays, User2, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Tab = ({ href, Icon, label }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href} className={`flex flex-col items-center text-xs ${active? 'text-brand': 'text-slate-500'}`}>
      <Icon size={22}/>
      <span>{label}</span>
    </Link>
  );
};

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100">
      <div className="max-w-md mx-auto px-8 py-3 flex items-center justify-between">
        <Tab href="/" Icon={Home} label="Home" />
        <Tab href="/messages" Icon={MessageSquare} label="Message" />
        <Link href="/create" className="btn btn-primary -mt-6 w-12 h-12 rounded-full flex items-center justify-center"><Plus/></Link>
        <Tab href="/calendar" Icon={CalendarDays} label="Calender" />
        <Tab href="/user" Icon={User2} label="Profile" />
      </div>
    </div>
  );
}
