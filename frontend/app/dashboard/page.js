"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Sidebar from '../../components/Sidebar';
import GlassCard from '../../components/GlassCard';
import { ShieldCheck, Radio, MessageSquare, Cpu } from 'lucide-react';

const SOCKET_SERVER = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [deviceUser, setDeviceUser] = useState(null);
  const [metrics, setMetrics] = useState({ uptime: '0h 0m 0s', count: 1248 });
  const chats = [
    { name: 'Alex Rivera (Design Lead)', time: '14:32', preview: 'The design guidelines look beautiful. Let’s ship it!', unread: 2 },
    { name: 'Dev Operations Group', time: '12:15', preview: 'Production sync pipeline successfully established.', unread: 0 }
  ];

  useEffect(() => {
    const socket = io(SOCKET_SERVER);
    socket.emit('init_session', { sessionId: "session_operator_01", usePairingCode: false });
    socket.on('status_update', (data) => { if (data.status === 'connected' && data.user) setDeviceUser(data.user); });
    
    let sec = 0;
    const t = setInterval(() => {
      sec++; const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
      setMetrics(p => ({ uptime: `${h}h ${m}m ${s}s`, count: p.count + (Math.random() > 0.8 ? 1 : 0) }));
    }, 1000);
    return () => { socket.disconnect(); clearInterval(t); };
  }, []);

  return (
    <div className="flex bg-darkBg min-h-screen text-slate-200"><Sidebar />
      <div className="flex-1 p-12 relative overflow-y-auto"><div className="mesh-glow top-[-80px] right-[-20px]"></div>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-glassBorder rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-4">
              <img src={deviceUser ? deviceUser.img : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"} className="w-12 h-12 rounded-full border border-glassBorder object-cover" />
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">{deviceUser ? deviceUser.name : "Staging Connection Node"} <ShieldCheck size={16} className="text-cyan-400" /></h2>
                <p className="text-xs text-slate-400 font-mono">{deviceUser ? `Active: +${deviceUser.phone}` : "Awaiting verification array handshake"}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="glass-card-interactive"><Radio size={20} className="text-cyan-400 mb-2" /><p className="text-xs text-slate-400 uppercase">Uptime</p><p className="text-xl font-mono font-bold text-white mt-1">{metrics.uptime}</p></GlassCard>
            <GlassCard className="glass-card-interactive"><MessageSquare size={20} className="text-indigo-400 mb-2" /><p className="text-xs text-slate-400 uppercase">Payload Sync Packets</p><p className="text-xl font-mono font-bold text-white mt-1">{metrics.count}</p></GlassCard>
            <GlassCard className="glass-card-interactive"><Cpu size={20} className="text-teal-400 mb-2" /><p className="text-xs text-slate-400 uppercase">Stability Index</p><p className="text-xl font-mono font-bold text-white mt-1">99% Normal</p></GlassCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block px-1">Synchronized Session Metadata</span>
              {chats.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.01] border border-glassBorder flex justify-between items-center">
                  <div><h4 className="text-sm font-semibold text-white">{c.name}</h4><p className="text-xs text-slate-400 truncate mt-0.5">{c.preview}</p></div>
                  <div className="text-right shrink-0"><span className="text-[10px] text-slate-500 block font-mono">{c.time}</span>{c.unread > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-cyan-400 text-darkBg rounded-full font-bold shadow-neonGlow">{c.unread}</span>}</div>
                </div>
              ))}
            </div>
            <GlassCard className="border-cyan-500/20 bg-gradient-to-b from-cyan-950/10 to-transparent"><div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-2"><Cpu size={16} className="animate-spin" /> Automation Core</div><p className="text-xs text-slate-400 leading-relaxed">The integrated assistant context interface is parsing inbound websocket signals to trigger auto-responses.</p></GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
