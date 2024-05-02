import { connection } from "../../db/db.js";

export const get_pacientes = async (req, res) => {
    try {
        const [result] = await connection.query("SELECT * FROM Usuario WHERE IdTipoUsuario = 1");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Paciente:", error);
        res.status(500).json({ message: "Error al obtener Pacientes." });
    }
};

export const insertarPaciente = async (req, res) => {
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
            Rut
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
        const [usuarioResult] = await connection.query(
            "INSERT INTO Usuario (CorreoElectronico, Contrasena, IdPersona, IdTipoUsuario) VALUES (?, ?, ?, ?)",
            [CorreoElectronico, Contrasena, idPersona, IdTipoUsuario]
        );
        const idUsuario = usuarioResult.insertId; // Obtener el ID del usuario insertado

        // Inserción en la tabla Psicologo
        await connection.query(
            "INSERT INTO Paciente (IdUsuario) VALUES (?)",
            [idUsuario]
        );

        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(201).json({ message: "Paciente Creado Correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear Paciente:", error);
        res.status(400).json({ message: "Error al procesar la solicitud." }); // Enviar respuesta de error al cliente
    }
};
