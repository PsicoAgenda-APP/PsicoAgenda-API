import { Router} from "express";
import { connection } from '../../db/db.js'; 

const router = Router();

router.get('/usuarioooo', async (req, res) => {
    try {
      const [result] = await connection.query('SELECT * FROM Usuario');
      res.json(result);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios.' });
    }
  });


export default router