import { Router } from "express";
import {insertarPsicologo, traerPsicologo} from "../controller/psicologo.controller.js";

const router = Router();


router.get('/usuarios/get_psicologos', traerPsicologo);


router.post('/usuarios/registro_psicologo', insertarPsicologo);


export default router