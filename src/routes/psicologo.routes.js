import { Router } from "express";
import {insertarPsicologo, get_psicologos} from "../controller/psicologo.controller.js";

const router = Router();


router.get('/psicologos/get_psicologos', get_psicologos);


router.post('/usuarios/registro_psicologo', insertarPsicologo);


export default router