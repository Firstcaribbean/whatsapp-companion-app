import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import path from 'path';

export const startWhatsAppSession = async (sessionId, io, socket, options = {}) => {
  const { usePairingCode, phoneNumber } = options;
  const sessionDir = path.join(process.cwd(), 'sessions', sessionId);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Web WhatsApp Companion', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  if (usePairingCode && phoneNumber && !sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
        const code = await sock.requestPairingCode(cleanedPhone);
        io.to(sessionId).emit('pairing_code', { code });
      } catch (err) {
        io.to(sessionId).emit('session_error', { error: 'Failed to generate companion code' });
      }
    }, 2500);
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr && !usePairingCode) io.to(sessionId).emit('qr_code', { qr });

    if (connection === 'open') {
      io.to(sessionId).emit('status_update', { 
        status: 'connected', 
        user: { name: 'WhatsApp Connected Node', phone: sock.user.id.split(':')[0], img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
      });
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startWhatsAppSession(sessionId, io, socket, options);
    }
  });
  return sock;
};
