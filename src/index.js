import express from 'express';
import { connection } from '../db/db.js'; 
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js'

const app = express();

// Middleware para analizar el cuerpo de la solicitud en formato JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

app.use(usuariosRoutes)

//ruta para consultar inicio de sesion
app.get('/usuarios', async (req, res) => {
  const { CorreoElectronico, Contrasena } = req.query;

  if (!CorreoElectronico || !Contrasena) {
    return res.status(400).json({ message: 'CorreoElectronico y Contrasena son parámetros obligatorios.' });
  }

  try {
    const [result] = await connection.query('SELECT * FROM Usuario WHERE CorreoElectronico = ? AND Contrasena = ?', [CorreoElectronico, Contrasena]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Credenciales Invalidas.' });

    }

    res.json(result);
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    res.status(500).json({ message: 'Error al buscar usuario.' });
  }
});

// Ruta para crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { Calle, Numero, IdComuna, PrimerNombre, SegundoNombre, ApellidoPaterno, ApellidoMaterno, Telefono, FechaNacimiento, CorreoElectronico, Contrasena, IdTipoUsuario } = req.body;

    // Inserción en la tabla Direccion
    const [direccionResult] = await connection.query('INSERT INTO Direccion (Calle, Numero, IdComuna) VALUES (?, ?, ?)', [Calle, Numero, IdComuna]);
    const idDireccion = direccionResult.insertId; // Obtener el ID de la dirección insertada

    // Inserción en la tabla Persona
    const [personaResult] = await connection.query('INSERT INTO Persona (PrimerNombre, SegundoNombre, ApellidoPaterno, ApellidoMaterno, Telefono, FechaNacimiento, IdDireccion) VALUES (?, ?, ?, ?, ?, ?, ?)', [PrimerNombre, SegundoNombre, ApellidoPaterno, ApellidoMaterno, Telefono, FechaNacimiento, idDireccion]);
    const idPersona = personaResult.insertId; // Obtener el ID de la persona insertada

    // Inserción en la tabla Usuario
    await connection.query('INSERT INTO Usuario (CorreoElectronico, Contrasena, IdPersona, IdTipoUsuario ) VALUES (?, ?, ?, ? )', [CorreoElectronico, Contrasena, idPersona, IdTipoUsuario]);

    // Enviar respuesta al cliente con un mensaje de éxito
    res.status(201).json({ message: 'Usuario creado correctamente.' });
  } catch (error) {
    // Manejo de errores
    console.error('Error al crear usuario:', error);
    res.status(400).json({ message: 'Error al procesar la solicitud.' }); // Enviar respuesta de error al cliente
  }
});



// Rutas para otras operaciones (PUT, DELETE, etc.)
app.put('/usuarios', (req, res) => res.send('Actualizando usuarios'));
app.delete('/usuarios', (req, res) => res.send('Borrando usuarios'));

// Puerto en el que se ejecutará el servidor
const PORT = 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
