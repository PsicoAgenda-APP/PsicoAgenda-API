import { Router } from "express";
import {insertarPsicologo, get_psicologos, actualizarPsicologo, datos_psicologo, horas_psicologo, citas_psicologo, historial_psicologo, atenciones_psicologo} from "../controller/psicologo.controller.js";

const router = Router();


router.get('/psicologos/get_psicologos', get_psicologos);
router.get('/psicologos/datos_psicologo', datos_psicologo);

router.get('/psicologos/horas_psicologo', horas_psicologo);


router.post('/usuarios/registro_psicologo', insertarPsicologo);

router.patch('/psicologos/patch_psicologo', actualizarPsicologo);

router.get('/psicologos/get_citas_psicologo', citas_psicologo);

router.get('/psicologos/get_historial_psicologo', historial_psicologo);

router.get('/psicologos/get_atenciones_psicologo', atenciones_psicologo);


export default router