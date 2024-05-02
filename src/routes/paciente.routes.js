import { Router } from "express";
import { get_pacientes, insertarPaciente } from "../controller/paciente.controller.js";


const router = Router();

router.get('/usuarios/get_pacientes', get_pacientes);


router.post('/usuarios/insertar_paciente', insertarPaciente);


export default router