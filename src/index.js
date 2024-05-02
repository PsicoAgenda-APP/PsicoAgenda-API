import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js'
import psicologosRoutes from './routes/psicologo.routes.js'
import pacientesRoutes from './routes/paciente.routes.js'

const app = express();

// Middleware para analizar el cuerpo de la solicitud en formato JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());



app.use(usuariosRoutes)
app.use(psicologosRoutes)
app.use(pacientesRoutes)



// Puerto en el que se ejecutará el servidor
const PORT = 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
