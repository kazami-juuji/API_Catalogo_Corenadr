import { Router } from 'express';

// Controladores de cada genero
import authMiddleware from '../config/authMiddleware.js';
import  uploads from  "../config/archivosConfig.js"
import { consultaAdmin, registro_Administrador, iniciar_sesion, recuperarPassword } from '../controllers/Administrador.controller.js';
import { insercion_Usuario, consultaUsuario, editar_usuario, eliminar_usuario } from '../controllers/Usuarios.controller.js';
import {cargar_imagen, eliminar_imagen} from '../controllers/Archivos.controller.js';
const router = Router();
import fs from 'fs';
import path from 'path';

router.post("/subir", uploads.single('imagen'),cargar_imagen);
router.delete("/eliminar/:nombre",eliminar_imagen);
// Ruta para listar imágenes existentes en la carpeta uploads
router.get("/imagenes", (req, res) => {
  const directorio = path.join(process.cwd(), 'uploads');

  fs.readdir(directorio, (err, archivos) => {
    if (err) {
      return res.status(500).json({ estatus: "error", msj: "Error al leer la carpeta" });
    }

    const imagenes = archivos.filter(nombre =>
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(nombre).toLowerCase())
    );

    res.json(imagenes);
  });
});


// Usuario
router.get("/usuario", consultaUsuario);
router.post("/registro",authMiddleware, insercion_Usuario);
router.put("/usuario/actualizar/:id", authMiddleware, editar_usuario);
router.delete("/usuario/eliminar/:id", authMiddleware, eliminar_usuario);
// router.put("/manejar_estado/:nombre", manejar_estado);

// Administrador
router.get("/Administrador", consultaAdmin);
router.post("/registroAdmin", registro_Administrador)
router.post("/login", iniciar_sesion);
router.post("/recuperar", recuperarPassword);


export default router;
