import mongoose from "mongoose";

const CatalogoModelo = new mongoose.Schema({
    administrador:{type:"String",require:true},
    password:{type:"String",require:true},
    correo:{type:"String",require:true},
    rol:{type:"String",require:true},
},{
    collection : 'administrador'
});

//identificador fuera del archivo, instancia de clase apartir de schema
export default mongoose.model('Administrador',CatalogoModelo);