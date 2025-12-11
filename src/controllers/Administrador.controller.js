import Administrador from "../models/Administrador.js"
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import transporter from "../config/nodemailer.js";

const consultaAdmin = async (recibido, respuesta) => {
    try {
        const usuarios = await Administrador.find();
        if (usuarios.length === 0) {
            return respuesta.status(404).json({estatus: "error",msj: "No e encontraron usuarios"});
        }
        respuesta.json(usuarios);
    }catch (error) {
        respuesta.status(500).json({error: error.message});
    }
}


const registro_Administrador = async (recibido, respuesta) => {
    try {
        const {administrador, password, correo } = recibido.body;
        const cifrado = await bcrypt.hash(password,10)
        const registro = new Administrador({"administrador":administrador, "password": cifrado, "correo": correo, "rol": "Administrador" });
        await registro.save();
        respuesta.status(201).json({"msj":"Administrador registrado", "registro":registro})
    } catch(error) {
        respuesta.status(500).json({"msj": error.msj})
    }
}

const iniciar_sesion = async (recibido, respuesta) => {
    try{
        const {administrador, password} = recibido.body;
        const consultaAdministrador = await Administrador.findOne({"administrador":administrador});
        if (!consultaAdministrador) return respuesta.status(500).json({"msj":`El administrador ${administrador} no esta registrado!`});
        let comparacion = await bcrypt.compare(password, consultaAdministrador.password)
        if (!comparacion) return respuesta.status(500).json({"msj":"Credenciales de acceso no validas!"});
        // if (consultaAdministrador.estado === "2") return res.status(500).json({"msj":"Tu cuenta ha sido desactivada!","icon":"warning"});

        // usuario.estado = "1"
        const token = jwt.sign(
            {
            "id":consultaAdministrador._id,
            "rol":consultaAdministrador.rol
            },
            process.env.JWT_SECRET,
            {
                "expiresIn":"1h"
            }
        );
        respuesta.status(200).json({"msj":"Inicio de Sesion exitoso", "token":token,"usuario":consultaAdministrador.administrador, "rol":consultaAdministrador.rol});
    } catch(error){
        respuesta.status(500).json({"msj": error.message});
    }

}
const recuperarPassword = async (recibido, respuesta) => {
  try {
    const { correo } = recibido.body;

    // 1. Buscar si el correo existe en la BD
    const administrador = await Administrador.findOne({ correo });

    if (!administrador) {
      return respuesta.status(404).json({ mensaje: "El correo no está registrado" });
    }

    // 2. Generar nueva contraseña temporal
    const newPassword = Math.random().toString(36).slice(-8);

    // 3. Encriptar nueva contraseña
    const newHash = await bcrypt.hash(newPassword, 10);

    // 4. Guardarla en la BD
    administrador.password = newHash;
    await administrador.save();

    // 5. Enviar por correo la nueva contraseña
    await transporter.sendMail({
      from: "Catalogo App <tu_correo@gmail.com>",
      to: correo,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Contraseña restablecida</h2>
        <p>Tu nueva contraseña temporal es:</p>
        <h3>${newPassword}</h3>
        <p>Te recordamos que esta sera tu nueva contraseña apartir de este momento.</p>
      `
    });

    return respuesta.json({ mensaje: "Se envió una nueva contraseña a tu correo." });

  } catch (error) {
    console.log(error);
    respuesta.status(500).json({ error: "Error en la recuperación de contraseña" });
  }
};

export {registro_Administrador, iniciar_sesion, consultaAdmin, recuperarPassword}