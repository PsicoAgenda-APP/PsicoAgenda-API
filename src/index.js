import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import usuariosRoutes from './routes/usuarios.routes.js'
import psicologosRoutes from './routes/psicologo.routes.js'
import pacientesRoutes from './routes/paciente.routes.js'
import webpayController from './controller/webpay.controller.js';
import emailController from './controller/email.controller.js';
import messageController from './controller/message.controller.js';


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware para analizar el cuerpo de la solicitud en formato JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

app.use('/api/v1/transbank', webpayController);
app.use('/api/v1/email', emailController);
app.use(usuariosRoutes)
app.use(psicologosRoutes)
app.use(pacientesRoutes)
app.use(messageController(io)); // Usa el controlador de mensajes y pasa el objeto io


// Puerto en el que se ejecutará el servidor
const PORT = 3000//process.env.PORT;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
