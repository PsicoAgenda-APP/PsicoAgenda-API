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


export const actualizarPaciente = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {
            IdPersona,
            IdDireccion,
            Calle,
            Numero,
            IdComuna,
            Telefono,
            PrimerNombre,
            SegundoNombre,
            ApellidoPaterno,
            ApellidoMaterno
        } = req.body;

        console.log("Datos del cuerpo de la solicitud:", req.body);


        // Inicializar array para almacenar los valores a actualizar en la base de datos
        const valoresDireccion = []
        const valoresPersona = []

        // Actualizar dirección si se proporcionan datos de dirección
        if (Calle && Numero && IdComuna) {
            valoresDireccion.push(`Calle = '${Calle}'`, `Numero = ${Numero}`, `IdComuna = ${IdComuna}`);
        }

        if (PrimerNombre) {
            valoresPersona.push(`PrimerNombre = '${PrimerNombre}'`);
        }

        if (SegundoNombre) {
            valoresPersona.push(`SegundoNombre = '${SegundoNombre}'`);                
        }

        if (ApellidoPaterno) {
            valoresPersona.push(`ApellidoPaterno = '${ApellidoPaterno}'`);               
        }

        if (ApellidoMaterno) {
            valoresPersona.push(`ApellidoMaterno = '${ApellidoMaterno}'`);
        }

        // Actualizar teléfono si se proporciona
        if (Telefono) {
            valoresPersona.push(`Telefono = '${Telefono}'`);
        }

        // Realizar la actualización en la base de datos
        await connection.query(
            `UPDATE Persona SET ${valoresPersona.join(', ')} WHERE IdPersona = ?`,
            [IdPersona]
        );

        await connection.query(
            `UPDATE Direccion SET ${valoresDireccion.join(', ')} WHERE IdDireccion = ?`,
            [IdDireccion]
        );

        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(200).json({ message: "Paciente actualizado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al actualizar paciente:", error);
        res.status(400).json({ message: "Error al procesar la solicitud de actualización." }); // Enviar respuesta de error al cliente
    }
};

export const updateCita = async (req, res) => { 
    const { IdPaciente, IdEstadoCita, IdCita } = req.query;

    if (!IdPaciente || !IdCita) {
        return res
            .status(400)
            .json({
                message: "Falta información para agendar la cita",
            });
    } else {

        try {
            await connection.query(
                "UPDATE Cita SET Cita.IdPaciente = ?, Cita.IdEstadoCita =  ? WHERE IdCita = ?",
                [IdPaciente, IdEstadoCita, IdCita]
            );
            res.json({ message: "Cita Agendada Correctamente" });
        } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar cita:", error);
            res.status(400).json({ message: "Error al procesar la solicitud de actualización." });
        } 

    }
}

export const finalizarCita = async (req, res) => { 
    const { Tratamiento, Diasgnostico, IdCita } = req.query;

    if (!IdCita) {
        return res
            .status(400)
            .json({
                message: "Falta información para agendar la cita",
            });
    } else {

        try {
            await connection.query(
                "UPDATE Cita SET Cita.Tratamiento = ?, Cita.Diasgnostico = ? WHERE IdCita = ?",
                [Tratamiento, Diasgnostico, IdCita]
            );
            res.json({ message: "Cita Actualizada Correctamente" });
        } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar cita:", error);
            res.status(400).json({ message: "Error al procesar la solicitud de actualización." });
        } 

    }
}
