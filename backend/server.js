import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { startWhatsAppSession } from './whatsappSession.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({ origin: frontendUrl }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: frontendUrl, methods: ['GET', 'POST'] }
});

const activeSessions = new Map();

io.on('connection', (socket) => {
  socket.on('init_session', async ({ sessionId, usePairingCode, phoneNumber }) => {
    socket.join(sessionId);
    try {
      const whatsappSock = await startWhatsAppSession(sessionId, io, socket, { usePairingCode, phoneNumber });
      activeSessions.set(sessionId, whatsappSock);
    } catch (err) {
      socket.emit('session_error', { error: 'Failed to process authentication instance.' });
    }
  });
});

httpServer.listen(port, () => console.log(`? Core WebSocket Engine online on port ${port}`));
