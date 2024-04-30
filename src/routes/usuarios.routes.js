import { Router} from "express";
import { traerUsuarios, actualizarUsuario, eliminarUsuario, loginUsuario, insertarUsuario } from "../controller/usuarios.controller.js";

const router = Router();

router.get('/usuarioooo', traerUsuarios );

//ruta para consultar inicio de sesion
router.get('/usuarios/login', loginUsuario);

router.put('/usuarios/actualizar_usuario',actualizarUsuario );

router.delete('/usuarios/elimina_rusuario', eliminarUsuario );

// Ruta para crear un nuevo usuario
router.post('/usuarios/registro_usuario', insertarUsuario);



export default router