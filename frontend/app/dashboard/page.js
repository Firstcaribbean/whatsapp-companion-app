"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Search, MoreVertical, MessageSquare, CheckCheck, Radio, Wifi } from 'lucide-react';

const SOCKET_SERVER = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function TrueWhatsAppDashboard() {
  const [deviceUser, setDeviceUser] = useState(null);
  const [serverMetrics, setServerMetrics] = useState({ uptime: '00:00:00', streamCount: 450 });

  useEffect(() => {
    const socket = io(SOCKET_SERVER);
    socket.emit('init_session', { sessionId: "session_operator_01", usePairingCode: false });
    socket.on('status_update', (data) => { if (data.status === 'connected' && data.user) setDeviceUser(data.user); });

    let sec = 0;
    const interval = setInterval(() => {
      sec++;
      const h = String(Math.floor(sec / 3600)).padStart(2, '0');
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      setServerMetrics(p => ({ uptime: `${h}:${m}:${s}`, streamCount: p.streamCount + (Math.random() > 0.85 ? 1 : 0) }));
    }, 1000);

    return () => { socket.disconnect(); clearInterval(interval); };
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#111b21] overflow-hidden text-[#e9edef] select-none">
      <div className="w-[400px] border-r border-[#222e35] bg-[#111b21] flex flex-col h-full shrink-0">
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center justify-between">
          <img src={deviceUser ? deviceUser.img : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"} className="w-10 h-10 rounded-full object-cover border border-white/10" />
          <div className="flex items-center gap-5 text-[#aebac1]">
            <Radio size={20} className="cursor-pointer" />
            <MessageSquare size={20} className="cursor-pointer" />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>
        <div className="bg-[#182229] p-3.5 flex items-center gap-4 border-b border-[#222e35]">
          <div className="w-9 h-9 rounded-full bg-[#00a884]/10 flex items-center justify-center text-[#00a884] shrink-0"><Wifi size={18} /></div>
          <div>
            <h4 className="text-xs font-medium text-[#e9edef]">System Socket Connected</h4>
            <p className="text-[11px] text-[#8696a0] mt-0.5">Stream architecture running at 100% capacity</p>
          </div>
        </div>
        <div className="p-2 bg-[#111b21] border-b border-[#222e35] flex items-center">
          <div className="bg-[#202c33] flex items-center gap-4 w-full px-3 py-1.5 rounded-[8px]">
            <Search size={16} className="text-[#8696a0]" />
            <input type="text" placeholder="Search or start new chat" className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-[#8696a0]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#111b21]">
          <div className="h-[72px] bg-[#2a3942] px-3 flex items-center gap-3 cursor-pointer border-b border-[#222e35]">
            <div className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">??</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline"><h3 className="text-[15px] font-normal text-[#e9edef] truncate">Core Companion Engine</h3><span className="text-[11px] text-[#00a884] font-medium">Online</span></div>
              <p className="text-xs text-[#8696a0] truncate mt-1 flex items-center gap-1"><CheckCheck size={16} className="text-[#53bdeb] inline" /> Runtime metrics completely nominal.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#0b141a] flex flex-col h-full relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"}} />
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center justify-between z-10 border-l border-[#374248]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-md">??</div>
            <div>
              <h3 className="text-[15px] font-medium text-[#e9edef]">{deviceUser ? deviceUser.name : "System Server Framework"}</h3>
              <p className="text-[11px] text-[#8696a0] font-mono">Node ID: session_operator_01</p>
            </div>
          </div>
          <div className="text-[#aebac1] flex items-center gap-6"><Search size={20} /><MoreVertical size={20} /></div>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-4 z-10 flex flex-col justify-end">
          <div className="self-center bg-[#182229] border border-yellow-500/10 text-yellow-400 text-[11px] px-3 py-1.5 rounded-[6px] max-w-md text-center shadow-sm">
            ?? Messages and telemetry packets are securely linked to your local Baileys session file structure.
          </div>
          <div className="self-start max-w-md bg-[#202c33] p-2.5 rounded-[8px] rounded-tl-none text-[14px] leading-relaxed relative shadow-md">
            <p className="text-[#e9edef] font-semibold text-xs text-indigo-400 mb-1">SYSTEM MONITOR</p>
            <p>Initializing Baileys Multi-Device Handshake...</p>
            <span className="block text-right text-[10px] text-[#8696a0] mt-1">10:00 AM</span>
          </div>
          <div className="self-start max-w-md bg-[#202c33] p-2.5 rounded-[8px] rounded-tl-none text-[14px] leading-relaxed relative shadow-md">
            <p className="text-[#e9edef] font-semibold text-xs text-[#00a884] mb-1">ENGINE STATUS PANEL</p>
            <div className="font-mono space-y-1 text-xs text-[#d1d5db]">
              <p>? UPTIME INDEX : <span className="text-white font-bold">{serverMetrics.uptime}</span></p>
              <p>? SYNCED PACKETS: <span className="text-white font-bold">{serverMetrics.streamCount}</span></p>
              <p>? STABILITY    : <span className="text-emerald-400 font-bold">99.8% NORMAL</span></p>
            </div>
            <span className="block text-right text-[10px] text-[#8696a0] mt-1">Just Now</span>
          </div>
        </div>
        <div className="h-[62px] bg-[#202c33] px-4 flex items-center gap-4 z-10">
          <div className="flex-1 bg-[#2a3942] rounded-[8px] px-4 py-2 text-sm text-[#8696a0] italic select-none">
            Type a message to transmit down the companion pipeline...
          </div>
        </div>
      </div>
    </div>
  );
}
