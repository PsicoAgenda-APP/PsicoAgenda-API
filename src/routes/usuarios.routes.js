import { Router} from "express";
import { traerUsuarios, actualizarUsuario, eliminarUsuario, loginUsuario, insertarUsuario } from "../controller/usuarios.controller.js";

const router = Router();

router.get('/usuarioooo', traerUsuarios );

//ruta para consultar inicio de sesion
router.get('/usuarios', loginUsuario);

router.put('/usuarios',actualizarUsuario );

router.delete('/usuarios', eliminarUsuario );

// Ruta para crear un nuevo usuario
router.post('/usuarios', insertarUsuario);



export default router