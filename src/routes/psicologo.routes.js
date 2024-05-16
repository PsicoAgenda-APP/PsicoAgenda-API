import { Router } from "express";
import {insertarPsicologo, get_psicologos, actualizarPsicologo, datos_psicologo, horas_psicologo} from "../controller/psicologo.controller.js";

const router = Router();


router.get('/psicologos/get_psicologos', get_psicologos);
router.get('/psicologos/datos_psicologo', datos_psicologo);

router.get('/psicologos/horas_psicologo', horas_psicologo);


router.post('/usuarios/registro_psicologo', insertarPsicologo);

router.patch('/psicologos/patch_psicologo', actualizarPsicologo);


export default router