var ruta=require("express").Router();
var { mostrarUsuarios, nuevoUsuario, buscarPorID, modificaUsuario,
     borrarUsuario }=require("../bd/usuariosBD");
const subirArchivo = require("../middlewares/subirArchivos");
var fs=require("fs");


ruta.get("/api/mostrarUsuarios", async (req, res)=>{
    var usuarios=await mostrarUsuarios();
    if (usuarios.length>0)
    res.status(200).json(usuarios);
else
res.status(400).json("No hay usuarios")
});

ruta.post("/api/nuevousuario", subirArchivo(), async (req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    if(error==0){
        res.status(200).json("Usuario registrado");
    }else{
        res.status(400).json("Datos incorrectos");
    }
});

ruta.get("/api/buscarUsuarioPorId/:id", async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    console.log(user);
    if(user==""){
        res.status(400).json("No se encontro ese usuario");
    }else{
        res.status(200).json(user);
    }
});

ruta.post("/api/editarUsuario", subirArchivo(), async(req, res)=>{
    try{
        const usuarioAct=await buscarPorID(req.body.id);
        if(req.file){
            req.body.foto=req.file.originalname;
            if (usuarioAct.foto) {
                const rutaFotoAnterior=`web/images/${usuarioAct.foto}`;
                fs.unlinkSync(rutaFotoAnterior);
                
            }
        }
    var error=await modificaUsuario(req.body);
    if(error==0){
        res.status(200).json("Usuario actualizado");
    }else{
        res.status(400).json("Error al actualizar el usuario")
    }}
    catch(error){
        console.error("Error al editar usuario", error);
        res.status(500).send("Error interno del servidor");
    }
});

ruta.get("/api/borrarUsuario/:id", async(req, res)=>{
    var error=await borrarUsuario(req.params.id);
    if(error==0){
        res.status(200).json("Usuario borrado");
    }else{
        res.status(400).json("Error al borrar el usuario");
    }
});

module.exports=ruta;