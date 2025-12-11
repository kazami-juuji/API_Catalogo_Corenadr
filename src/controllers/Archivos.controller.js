import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";

const nombreArchivos = fileURLToPath(import.meta.url);
const nombreDirectorio = dirname(nombreArchivos);

// Subida
export const cargar_imagen = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ estatus: "error", msj: "No se ha cargado ningún archivo" });
    }

    res.status(201).json({
        estatus: "correcto",
        msj: "Archivo subido correctamente",
        nombreArchivo: req.file.filename
    });
};

// Eliminación
export const eliminar_imagen = (req, res) => {
    const nombreArchivo = req.params.nombre;
    const ruta = path.join(nombreDirectorio, '../../uploads', nombreArchivo);

    fs.unlink(ruta, (err) => {
        if (err) {
            return res.status(404).json({ estatus: "error", msj: "Archivo no encontrado o ya eliminado" });
        }
        res.json({ estatus: "correcto", msj: "Archivo eliminado correctamente" });
    });
};
