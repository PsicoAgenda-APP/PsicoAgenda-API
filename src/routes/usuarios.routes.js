import { Router} from "express";
import { traerUsuarios, cambiarContrasena, eliminarUsuario, loginUsuario, insertarUsuario } from "../controller/usuarios.controller.js";

const router = Router();

router.get('/usuarioooo', traerUsuarios );

//ruta para consultar inicio de sesion
router.get('/usuarios/login', loginUsuario);


// Ruta para crear un nuevo usuario
router.post('/usuarios/registro_usuario', insertarUsuario);


router.put('/usuarios/cambiar_contrasena',cambiarContrasena );

router.delete('/usuarios/elimina_rusuario', eliminarUsuario );



export default router