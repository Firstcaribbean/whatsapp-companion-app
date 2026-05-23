"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Link2, Settings, MessageSquare, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Pair Session", icon: Link2, path: "/connect" }
  ];

  return (
    <div className="w-72 border-r border-glassBorder glass-panel h-screen flex flex-col justify-between p-6 z-10">
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-neonGlow">W</div>
          <div>
            <h1 className="font-bold text-md text-white tracking-wide">Companion.io</h1>
            <p className="text-xs text-slate-400">v1.0 Suite</p>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map((link, idx) => {
            const Icon = link.icon; const isActive = pathname === link.path;
            return (
              <Link key={idx} href={link.path} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                <Icon size={18} /> {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-glassBorder pt-4 flex items-center justify-between">
        <span className="text-xs text-emerald-400 font-mono">? Engine Normal</span>
        <Link href="/" className="text-slate-500 hover:text-red-400"><LogOut size={16} /></Link>
      </div>
    </div>
  );
}
