import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuración de transporte para Outlook
const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: 'psicoagendaapp@hotmail.com',
        pass: 'Manchas_15'
    }
});

// Ruta para enviar correo
router.post('/send', async (req, res) => {
    const { to, subject, text, html } = req.body;

    const mailOptions = {
        from: 'psicoagendaapp@hotmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent', info: info });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending email', details: error });
    }
});

export default router;