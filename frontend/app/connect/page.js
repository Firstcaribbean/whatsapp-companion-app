"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { MoreVertical, MessageSquare, RefreshCw, Laptop, Smartphone } from 'lucide-react';

const SOCKET_SERVER = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function WhatsAppWebLogin() {
  const router = useRouter();
  const [method, setMethod] = useState('qr');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [qrString, setQrString] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [connStatus, setConnStatus] = useState('disconnected');

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER); setSocket(socketInstance);
    socketInstance.on('qr_code', (data) => { setQrString(data.qr); setLoading(false); });
    socketInstance.on('pairing_code', (data) => { setPairingCode(data.code); setLoading(false); });
    socketInstance.on('status_update', (data) => {
      setConnStatus(data.status);
      if (data.status === 'connected') { setTimeout(() => router.push('/dashboard'), 1000); }
    });
    return () => socketInstance.disconnect();
  }, [router]);

  const startSyncing = (usePhone = false) => {
    if (!socket) return; setLoading(true); setQrString(''); setPairingCode('');
    socket.emit('init_session', { sessionId: "session_operator_01", usePairingCode: usePhone, phoneNumber: usePhone ? phoneNumber : null });
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex flex-col relative select-none">
      <div className="h-[222px] bg-[#00a884] w-full absolute top-0 left-0 z-0" />
      <div className="max-w-[1000px] mx-auto w-full pt-10 pb-6 flex items-center gap-4 z-10 text-white px-4">
        <Smartphone size={28} />
        <span className="font-semibold tracking-wider text-xs uppercase opacity-90">WhatsApp Web Companion Engine</span>
      </div>
      <div className="max-w-[1000px] mx-auto w-full flex-1 bg-[#222e35] shadow-2xl rounded-[3px] z-10 mb-12 flex flex-col md:flex-row p-12 overflow-y-auto border border-white/5">
        <div className="flex-1 pr-6 text-slate-300">
          <h1 className="text-2xl font-light text-[#e9edef] mb-8">To use WhatsApp Companion on your computer</h1>
          <ol className="space-y-5 text-[15px] text-[#8696a0] list-decimal list-inside pl-1 leading-relaxed">
            <li>Open WhatsApp on your phone</li>
            <li>Tap <span className="text-[#e9edef] font-medium">Menu</span> or <span className="text-[#e9edef] font-medium">Settings</span> and select <span className="text-[#e9edef] font-medium">Linked Devices</span></li>
            <li>Tap on <span className="text-[#e9edef] font-medium">Link a Device</span></li>
            <li>Point your phone to this screen to capture the authentication matrix</li>
          </ol>
          <div className="mt-10 border-t border-[#2a3942] pt-6">
            <button onClick={() => { setMethod(method === 'qr' ? 'phone' : 'qr'); setPairingCode(''); }} className="text-[#00a884] text-sm font-medium hover:underline">
              {method === 'qr' ? "Link with phone number instead" : "Link with QR code instead"}
            </button>
          </div>
        </div>
        <div className="w-full md:w-[320px] flex flex-col items-center justify-center mt-8 md:mt-0 md:border-l border-[#2a3942] md:pl-6">
          {method === 'qr' ? (
            <div className="bg-white p-3 rounded-[4px] relative shadow-md">
              {qrString ? <QRCodeSVG value={qrString} size={240} level="H" /> : (
                <div className="w-[240px] h-[240px] bg-[#111b21] flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={24} className="animate-spin text-[#00a884]" />
                  <span className="text-xs text-[#8696a0]">Awaiting stream...</span>
                </div>
              )}
              {connStatus === 'connected' && <div className="absolute inset-0 bg-[#111b21]/95 flex items-center justify-center text-[#00a884] font-bold text-sm">Authenticated</div>}
            </div>
          ) : (
            <div className="w-full text-center px-4">
              <input type="text" placeholder="Enter Phone Number (+1...)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading || pairingCode} className="w-full px-4 py-2.5 bg-[#111b21] rounded-[6px] border border-[#2a3942] text-[#e9edef] text-center font-mono focus:outline-none focus:border-[#00a884] text-sm mb-4" />
              {pairingCode ? (
                <div className="p-4 bg-[#111b21] border border-[#2a3942] rounded-[4px] font-mono text-2xl font-bold tracking-widest text-[#00a884] uppercase">{pairingCode}</div>
              ) : (
                <button onClick={() => startSyncing(true)} disabled={!phoneNumber || loading} className="w-full py-2.5 bg-[#00a884] hover:bg-[#008f72] text-[#111b21] rounded-[4px] font-semibold text-sm transition-colors">Generate Pairing Code</button>
              )}
            </div>
          )}
          {!qrString && !loading && method === 'qr' && (
            <button onClick={() => startSyncing(false)} className="mt-4 text-xs font-semibold uppercase text-[#00a884] tracking-wider hover:opacity-80">Click to fetch code canvas</button>
          )}
        </div>
      </div>
    </div>
  );
}
