import express from 'express';
import { connection } from "../../db/db.js";

const router = express.Router();

export default function(io) {
  // Endpoint para obtener mensajes entre dos usuarios
  router.get('/messages', async (req, res) => {
      const { SenderId, ReceiverId } = req.query;

      try {
          const [messages] = await connection.query(
              'SELECT * FROM Mensajes WHERE (SenderId = ? AND ReceiverId = ?) OR (SenderId = ? AND ReceiverId = ?) ORDER BY Timestamp',
              [SenderId, ReceiverId, ReceiverId, SenderId]
          );
          res.json(messages);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error retrieving messages' });
      }
  });

  // Endpoint para enviar un nuevo mensaje
  router.post('/messages', async (req, res) => {
      const { SenderId, ReceiverId, Mensaje } = req.body;

      try {
          const [result] = await connection.query(
              'INSERT INTO Mensajes (SenderId, ReceiverId, Mensaje) VALUES (?, ?, ?)',
              [SenderId, ReceiverId, Mensaje]
          );
          const newMessage = { IdMensaje: result.insertId, SenderId, ReceiverId, Mensaje, Timestamp: new Date() };
          io.emit('message', newMessage);
          res.status(201).json(newMessage);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error sending message' });
      }
  });

  // Socket.io connection
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return router;
};
