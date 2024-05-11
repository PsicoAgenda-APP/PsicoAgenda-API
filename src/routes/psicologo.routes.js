import { Router } from "express";
import {insertarPsicologo, get_psicologos, actualizarPsicologo} from "../controller/psicologo.controller.js";

const router = Router();


router.get('/psicologos/get_psicologos', get_psicologos );




router.post('/usuarios/registro_psicologo', insertarPsicologo);

router.patch('/psicologos/patch_psicologo', actualizarPsicologo);


export default router