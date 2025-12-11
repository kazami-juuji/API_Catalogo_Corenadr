import mongoose from "mongoose";

const CatalogoModelo = new mongoose.Schema({
    productor:{type:"String",require:true},
    marca:{type:"String",require:true},
    telefono1:{type:"number",require:true},// grupoProducto:{type:"String",require:true},
    telefono2:{type:"number",require:true},// grupoProducto:{type:"String",require:true},
    giroPrincipal:{type:"String",require:true},
    producto:{type:"String",require:true},
    presentacion:{type:"String",require:true},
    poblado:{type:"String",require:true},
    alcaldia:{type:"String",require:true},
    paginaWeb:{type:"String",require:true},
    facebook:{type:"String",require:true},
    instagram:{type:"String",require:true},
    whatsapp:{type:"String",require:true}
},{
    collection : 'usuarios'
});

//identificador fuera del archivo, instancia de clase apartir de schema
export default mongoose.model('Usuarios',CatalogoModelo);