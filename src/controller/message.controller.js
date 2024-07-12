import express from 'express';
import { connection } from '../db.js';

const router = express.Router();

router.get('/messages', async (req, res) => {
  const { SenderId, ReceiverId } = req.query;

  try {
    const [rows] = await connection.query(
      `SELECT * FROM Mensajes WHERE (SenderId = ? AND ReceiverId = ?) OR (SenderId = ? AND ReceiverId = ?) ORDER BY Timestamp`,
      [SenderId, ReceiverId, ReceiverId, SenderId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', async (msg) => {
      try {
        const { SenderId, ReceiverId, Mensaje } = msg;
        const [result] = await connection.query(
          `INSERT INTO Mensajes (SenderId, ReceiverId, Mensaje) VALUES (?, ?, ?)`,
          [SenderId, ReceiverId, Mensaje]
        );
        const newMessage = { IdMensaje: result.insertId, SenderId, ReceiverId, Mensaje, Timestamp: new Date() };
        io.emit('message', newMessage);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

export default router;