import { connection } from "../../db/db.js";


export const get_psicologos = async (req, res) => {
    try {
        const [result] = await connection.query
        ("SELECT " +
         "CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre, "+
         "e.NombreEspecialidad, u.CorreoElectronico, ps.ValorSesion, ps.Descripcion FROM Psicologo ps " + 
         "INNER JOIN Especialidad e ON ps.IdEspecialidad  = e.IdEspecialidad " +
         "INNER JOIN Usuario u ON ps.IdUsuario = u.IdUsuario INNER JOIN Persona p ON p.IdPersona = u.IdPersona");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Psicologos:", error);
        res.status(500).json({ message: "Error al obtener Psicologos." });
    }
};


export const insertarPsicologo = async (req, res) => {
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
            ValorSesion,
            IdEspecialidad // Agregado el campo IdEspecialidad
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
            Rut === "" ||
            ValorSesion === "" // Agregado ValorSesion a la verificación de campos obligatorios
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
            "INSERT INTO Psicologo (ValorSesion, IdEspecialidad, IdUsuario) VALUES (?, ?, ?)",
            [ValorSesion, IdEspecialidad, idUsuario]
        );

        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(201).json({ message: "Psicologo creado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear usuario Psicologo:", error);
        res.status(400).json({ message: "Error al procesar la solicitud." }); // Enviar respuesta de error al cliente
    }
};


export const actualizarPsicologo = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {
            IdPsicologo, // Se necesita el ID del psicólogo para identificar qué psicólogo actualizar
            Calle,
            Numero,
            IdComuna,
            CorreoElectronico,
            ValorSesion,
            Telefono
        } = req.body;

        console.log("Datos del cuerpo de la solicitud:", req.body);

        // Verificar si algún campo para actualizar está presente en la solicitud
        if (
            !IdPsicologo ||
            (!Calle && !Numero && !IdComuna && !CorreoElectronico && !ValorSesion && !Telefono)
        ) {
            return res.status(400).json({ message: "Faltan campos para actualizar." });
        }

        // Inicializar array para almacenar los valores a actualizar en la base de datos
        const valoresActualizados = [];

        // Actualizar dirección si se proporcionan datos de dirección
        if (Calle && Numero && IdComuna) {
            valoresActualizados.push(`Calle = '${Calle}'`, `Numero = '${Numero}'`, `IdComuna = '${IdComuna}'`);
        }

        // Actualizar correo electrónico si se proporciona
        if (CorreoElectronico) {
            valoresActualizados.push(`CorreoElectronico = '${CorreoElectronico}'`);
        }

        // Actualizar valor de sesión si se proporciona
        if (ValorSesion) {
            valoresActualizados.push(`ValorSesion = '${ValorSesion}'`);
        }

        // Actualizar teléfono si se proporciona
        if (Telefono) {
            valoresActualizados.push(`Telefono = '${Telefono}'`);
        }

        // Si no hay campos para actualizar, enviar un mensaje de error
        if (valoresActualizados.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron campos válidos para actualizar." });
        }

        // Realizar la actualización en la base de datos
        await connection.query(
            `UPDATE Psicologo SET ${valoresActualizados.join(', ')} WHERE IdPsicologo = ?`,
            [IdPsicologo]
        );

        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(200).json({ message: "Psicologo actualizado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al actualizar psicólogo:", error);
        res.status(400).json({ message: "Error al procesar la solicitud de actualización." }); // Enviar respuesta de error al cliente
    }
};

