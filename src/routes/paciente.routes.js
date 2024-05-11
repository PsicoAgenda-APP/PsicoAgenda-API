import { Router } from "express";
import { get_pacientes, insertarPaciente, actualizarPaciente } from "../controller/paciente.controller.js";


const router = Router();

router.get('/usuarios/get_pacientes', get_pacientes);


router.post('/usuarios/insertar_paciente', insertarPaciente);

router.patch('/usuarios/patch_paciente', actualizarPaciente);


export default router