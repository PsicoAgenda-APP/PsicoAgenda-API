import { connection } from "../../db/db.js";


export const traerUsuarios = async (req, res) => {
    try {
        const [result] = await connection.query("SELECT * FROM Usuario");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};


export const loginUsuario = async (req, res) => {
    const { CorreoElectronico, Contrasena } = req.query;

    if (!CorreoElectronico || !Contrasena) {
        return res
            .status(400)
            .json({
                message: "CorreoElectronico y Contrasena son parámetros obligatorios.",
            });
    }

    try {
        const [result] = await connection.query(
            "SELECT * FROM Usuario WHERE CorreoElectronico = ? AND Contrasena = ?",
            [CorreoElectronico, Contrasena]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Credenciales Invalidas." });
        }

        res.json(result);
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        res.status(500).json({ message: "Error al buscar usuario." });
    }
};

export const insertarUsuario = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {
            Calle,
            Numero,
            IdComuna,
            PrimerNombre,
            SegundoNombre,
            ApellidoPaterno,
            ApellidoMaterno,
            Telefono,
            FechaNacimiento,
            CorreoElectronico,
            Contrasena,
            IdTipoUsuario,
            Rut,
        } = req.body;

        console.log("Datos del cuerpo de la solicitud:", req.body);

        // Verificar si algún campo obligatorio está vacío
        if (
            Calle === "" ||
            Numero === "" ||
            IdComuna === "" ||
            PrimerNombre === "" ||
            SegundoNombre === "" ||
            ApellidoPaterno === "" ||
            ApellidoMaterno === "" ||
            Telefono === "" ||
            FechaNacimiento === "" ||
            CorreoElectronico === "" ||
            Contrasena === "" ||
            IdTipoUsuario === "" ||
            Rut === "" 
        ) {
            return res
                .status(400)
                .json({ message: "Faltan o hay campos obligatorios vacíos en la solicitud." });
        }

        // Inserción en la tabla Direccion
        const [direccionResult] = await connection.query(
            "INSERT INTO Direccion (Calle, Numero, IdComuna) VALUES (?, ?, ?)",
            [Calle, Numero, IdComuna]
        );
        const idDireccion = direccionResult.insertId; // Obtener el ID de la dirección insertada

        // Inserción en la tabla Persona
        const [personaResult] = await connection.query(
            "INSERT INTO Persona (PrimerNombre, SegundoNombre, ApellidoPaterno, ApellidoMaterno, Telefono, FechaNacimiento, IdDireccion, Rut) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                PrimerNombre,
                SegundoNombre,
                ApellidoPaterno,
                ApellidoMaterno,
                Telefono,
                FechaNacimiento,
                idDireccion,
                Rut,
            ]
        );
        const idPersona = personaResult.insertId; // Obtener el ID de la persona insertada

        // Inserción en la tabla Usuario
        await connection.query(
            "INSERT INTO Usuario (CorreoElectronico, Contrasena, IdPersona, IdTipoUsuario ) VALUES (?, ?, ?, ? )",
            [CorreoElectronico, Contrasena, idPersona, IdTipoUsuario]
        );

        


        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(201).json({ message: "Usuario creado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear usuario:", error);
        res.status(400).json({ message: "Error al procesar la solicitud." }); // Enviar respuesta de error al cliente
    }
};


export const cambiarContrasena = async (req, res) => {
    const { CorreoElectronico, NuevaContrasena } = req.body;

    if (!CorreoElectronico || !NuevaContrasena) {
        return res.status(400).json({
            message: "CorreoElectronico y NuevaContrasena son parámetros obligatorios.",
        });
    }

    try {
        const [result] = await connection.query(
            "SELECT * FROM Usuario WHERE CorreoElectronico = ?",
            [CorreoElectronico]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Actualizar la contraseña del usuario
        await connection.query(
            "UPDATE Usuario SET Contrasena = ? WHERE CorreoElectronico = ?",
            [NuevaContrasena, CorreoElectronico]
        );

        res.json({ message: "Contraseña cambiada exitosamente." });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña." });
    }
};
    

export const eliminarUsuario = (req, res) => res.send("Borrando usuarios");
