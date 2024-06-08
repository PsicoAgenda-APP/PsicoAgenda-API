import { Router } from "express";
import { obtenerIdUsuario, traerUsuarios, cambiarContrasena, eliminarUsuario, loginUsuario, insertarUsuario, getDetallesCitas, getDetallesCitasById, getProximaCitaById, datosPersona, saveToken } from "../controller/usuarios.controller.js";

const router = Router();

router.get('/usuarioooo', traerUsuarios);

// Ruta para consultar inicio de sesión
router.get('/usuarios/login', loginUsuario);

// Ruta para crear un nuevo usuario
router.post('/usuarios/registro_usuario', insertarUsuario);

router.get('/usuarios/cambiar_contrasena', cambiarContrasena);

router.delete('/usuarios/elimina_rusuario', eliminarUsuario);

router.get('/usuarios/get_citas', getDetallesCitas);

router.get('/usuarios/get_citas_by_id', getDetallesCitasById);

router.get('/usuarios/get_proxima_cita_by_id', getProximaCitaById);

router.get('/usuarios/obtener_id', obtenerIdUsuario);

router.get('/usuarios/datosPaciente', datosPersona);

router.get('/usuarios/guadarToken', saveToken);


export default router;
