"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import GlassCard from '../../components/GlassCard';
import { QrCode, Phone, RefreshCw, CheckCircle2 } from 'lucide-react';

const SOCKET_SERVER = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function ConnectionFlow() {
  const router = useRouter();
  const [method, setMethod] = useState('qr');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [qrString, setQrString] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [connStatus, setConnStatus] = useState('disconnected');
  const [statusMsg, setStatusMsg] = useState('Awaiting activation command...');

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER); setSocket(socketInstance);
    socketInstance.on('qr_code', (data) => { setQrString(data.qr); setLoading(false); });
    socketInstance.on('pairing_code', (data) => { setPairingCode(data.code); setLoading(false); });
    socketInstance.on('status_update', (data) => {
      setConnStatus(data.status); if (data.message) setStatusMsg(data.message);
      if (data.status === 'connected') { setTimeout(() => router.push('/dashboard'), 1500); }
    });
    return () => socketInstance.disconnect();
  }, [router]);

  const initiateConnection = (usePhone = false) => {
    if (!socket) return; setLoading(true); setQrString(''); setPairingCode('');
    socket.emit('init_session', { sessionId: "session_operator_01", usePairingCode: usePhone, phoneNumber: usePhone ? phoneNumber : null });
  };

  return (
    <div className="flex bg-darkBg min-h-screen text-slate-200"><Sidebar />
      <div className="flex-1 p-12 relative overflow-y-auto"><div className="mesh-glow top-[-50px] right-[-50px]"></div>
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-white">Link Companion Device</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-xl flex flex-col gap-2">
              <button onClick={() => setMethod('qr')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${method === 'qr' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400'}`}><QrCode size={18} /> QR Code Matrix</button>
              <button onClick={() => setMethod('phone')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${method === 'phone' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400'}`}><Phone size={18} /> Phone Pairing Code</button>
            </div>
            <div className="glass-panel p-4 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 block font-bold">NODE BRIDGE STATUS:</span>
              <span className="text-white font-mono block uppercase">{connStatus}</span>
              <p className="text-slate-400 mt-2 bg-slate-950 p-2 rounded border border-glassBorder">{statusMsg}</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
              <AnimatePresence mode="wait">
                {method === 'qr' ? (
                  <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl relative mb-4 border border-white/20">
                      {qrString ? <QRCodeSVG value={qrString} size={200} /> : <RefreshCw size={24} className="animate-spin text-cyan-600 m-20" />}
                      {connStatus === 'connected' && <div className="absolute inset-0 bg-slate-950/90 rounded-2xl flex items-center justify-center text-emerald-400 font-bold">Authorized</div>}
                    </div>
                    {!qrString && !loading && <button onClick={() => initiateConnection(false)} className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-neonGlow">Request Sync Stream</button>}
                  </motion.div>
                ) : (
                  <motion.div key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm flex flex-col items-center">
                    <input type="text" placeholder="+1 555 0199" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading || pairingCode} className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-glassBorder text-white text-center font-mono mb-4 focus:outline-none focus:border-cyan-500" />
                    {pairingCode ? (
                      <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-xl font-mono text-3xl font-extrabold tracking-widest text-cyan-400 w-full text-center">{pairingCode}</div>
                    ) : (
                      <button onClick={() => initiateConnection(true)} disabled={!phoneNumber || loading} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-neonGlow">Fetch Code String</button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
