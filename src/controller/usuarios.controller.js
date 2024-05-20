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

export const getDetallesCitas = async (req, res) => {
    try {
        const sqlQuery = `
        SELECT
                up.IdUsuario,
                DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS fecha,
                c.HoraCita AS hora,
                CONCAT(pp.PrimerNombre, ' ', pp.SegundoNombre, ' ', pp.ApellidoPaterno, ' ', pp.ApellidoMaterno) AS nombre_paciente,
                pp.Rut AS rut_paciente,
                c.Diagnostico,
                c.Tratamiento,
                CONCAT(pp2.PrimerNombre, ' ', pp2.SegundoNombre, ' ', pp2.ApellidoPaterno, ' ', pp2.ApellidoMaterno) AS nombre_psicologo,
                ec.DescripcionEstado AS estado_cita
            FROM
                Cita c
            INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
            INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
            INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
            INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
            INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
            INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
            INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
            
        `;

        const [result] = await connection.query(sqlQuery);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener detalles de citas:", error);
        res.status(500).json({ message: "Error al obtener detalles de citas." });
    }
};

export const getDetallesCitasById = async (req, res) => {
    try {
        const { IdPaciente } = req.query;

        // Consulta SQL para obtener las citas asociadas al usuario
        const sqlQuery = `
        SELECT
        up.IdUsuario,
        DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS fecha,
        c.HoraCita AS hora,
        CONCAT(pp.PrimerNombre, ' ', pp.SegundoNombre, ' ', pp.ApellidoPaterno, ' ', pp.ApellidoMaterno) AS nombre_paciente,
        pp.Rut AS rut_paciente,
        c.Diagnostico,
        c.Tratamiento,
        CONCAT(pp2.PrimerNombre, ' ', pp2.SegundoNombre, ' ', pp2.ApellidoPaterno, ' ', pp2.ApellidoMaterno) AS nombre_psicologo,
        ec.DescripcionEstado AS estado_cita
    FROM
        Cita c
    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
    INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
    INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
    INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
    INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
    INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
    WHERE pc.IdPaciente = ?;
    
        `;

        // Ejecutar la consulta SQL y obtener el resultado
        const [result] = await connection.query(sqlQuery, [IdPaciente]);

        // Verificar si se encontraron citas asociadas al usuario
        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron citas para este usuario." });
        }

        // Enviar el resultado como respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener detalles de citas:", error);
        res.status(500).json({ message: "Error al obtener detalles de citas." });
    }
};
