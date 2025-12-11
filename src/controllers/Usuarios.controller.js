import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import Usuarios from "../models/Usuarios.js";
import { json } from 'express';

const consultaUsuario = async (recibido, respuesta) => {
    try {
        const usuarios = await Usuarios.find();
        if (usuarios.length === 0) {
            return respuesta.status(404).json({estatus: "error",msj: "No e encontraron usuarios"});
        }
        respuesta.json(usuarios);
    }catch (error) {
        respuesta.status(500).json({error: error.message});
    }
}
const insercion_Usuario = async (recibido, respuesta) => {
    try {
        if(respuesta.user.rol !== "Administrador") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        const {productor, marca, telefono1, telefono2,  giroPrincipal, producto, presentacion, poblado, alcaldia, paginaWeb, facebook, instagram, whatsapp} = recibido.body;

        if (!productor || !marca || !telefono1  || !telefono2 || !giroPrincipal || !producto || !presentacion || !poblado || !alcaldia || !paginaWeb || !facebook || !instagram || !whatsapp) {
            return respuesta.status(400).json({ error: "Todos los campos son obligatorios." });
        }
        
        const nuevoProductor = new Usuarios({
            productor,
            marca,
            telefono1,
            telefono2,
            giroPrincipal,
            producto,
            presentacion,
            poblado,
            alcaldia,
            paginaWeb,
            facebook,
            instagram,
            whatsapp,
        });
        await nuevoProductor.save();
        respuesta.status(201).json({ mensaje: "Productor agregado", usuarios: nuevoProductor });
    } catch (error) {
        console.error("Error en insertar_Productor:", error);
        respuesta.status(500).json({ error: error.message });
    }
}
const editar_usuario = async (recibido, respuesta) => {
    try {
        if (respuesta.user.rol !== "Administrador") {
            return respuesta.status(403).json({ msj: "No tienes permisos para efectuar esta acción" });
        }

        const id = recibido.params.id;
        const datosActualizados = recibido.body;
        // const nombreActual = recibido.params.nombreUsuario;

        const resultado = await Usuarios.findByIdAndUpdate(id, datosActualizados,{
            new : true,
            runValidators : true
        });

        if (!resultado) {
            return respuesta.status(404).json({ mensaje : "usuario no encontrado"});
        }
        respuesta.status(200).json(resultado);
        // return respuesta.status(200).json({ mensaje: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error("Error en editar_usuario", error);
        respuesta.status(500).json({ error: error.message });
    }
};

 const eliminar_usuario = async (recibido,respuesta)=> {
    try {
        if(respuesta.user.rol !== "Administrador") return respuesta.status(500).json({"msj":"no tienes permisos para efectuar esta accion"});
        
        const id = recibido.params.id;
        const resultado = await Usuarios.findByIdAndDelete(id);
          if (!resultado) {
            return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        return respuesta.status(200).json({mensaje: "Usuario eliminado correctamente"});
    } catch( error) {
        console.error("error en actualizar usuario", error);
        respuesta.status(500).json({error: error.message});
        
    }
 }
export {insercion_Usuario, consultaUsuario, editar_usuario, eliminar_usuario};