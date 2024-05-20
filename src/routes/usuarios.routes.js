import { Router } from "express";
import { traerUsuarios, cambiarContrasena, eliminarUsuario, loginUsuario, insertarUsuario, getDetallesCitas, getDetallesCitasById, getProximaCitaById } from "../controller/usuarios.controller.js";

const router = Router();

router.get('/usuarioooo', traerUsuarios);

// Ruta para consultar inicio de sesión
router.get('/usuarios/login', loginUsuario);

// Ruta para crear un nuevo usuario
router.post('/usuarios/registro_usuario', insertarUsuario);

router.put('/usuarios/cambiar_contrasena', cambiarContrasena);

router.delete('/usuarios/elimina_rusuario', eliminarUsuario);

router.get('/usuarios/get_citas', getDetallesCitas);

router.get('/usuarios/get_citas_by_id', getDetallesCitasById);

router.get('/usuarios/get_proxima_cita_by_id', getProximaCitaById);

export default router;
