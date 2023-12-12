var ruta=require("express").Router();
var {mostrarUsuarios, nuevoUsuario, modificaUsuario, buscarPorID,
     borrarUsuario, buscarPorUsuario, verificarPassword}=require("../bd/usuariosBD");
var fs=require("fs");
var subirArchivo=require("../middlewares/subirArchivos");
var {autorizado, admin}=require("../middlewares/funcionesPassword");


ruta.get("/usuarios", autorizado,async(req, res)=>{
    var usuarios=await mostrarUsuarios();
    res.render("usuarios/mostrar", {usuarios});
});

ruta.get("/", async(req, res)=>{
    res.render("usuarios/login");
});

ruta.get("/mostrarUsuarios", autorizado, async(req, res)=>{
    res.render("usuarios/mostrar", {usuarios});
});

ruta.get("/nuevousuario", async(req, res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario", subirArchivo(), async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error= await nuevoUsuario(req.body);
    console.log(error);
    res.redirect("/");
});

ruta.get("/principal", autorizado, async (req, res) => {
    if (req.session.admin) {
        // Contenido específico para administradores
        res.render("usuarios/principalAdmin");
    } else {
        // Contenido para usuarios regulares
        res.render("usuarios/principalUsuario");
    }
});

ruta.get("/editar/:id",async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    res.render("usuarios/modificar",{user});
    console.log(user);
 
});

ruta.post("/editar", subirArchivo(), async(req, res)=>{
    try{
        const usuarioAct=await buscarPorID(req.body.id);
        if (req.file) {
            req.body.foto=req.file.originalname;
            if (usuarioAct.foto) {
                const rutaFotoAnterior=`web/images${usuarioAct.foto}`;
               fs.unlinkSync(rutaFotoAnterior);
            }}else{
            req.body.foto=req.body.fotoVieja;
        }
        await modificaUsuario(req.body);
        res.redirect("/");
    }catch(error){
        console.error("Error al editar registro", error);
        res.status(500).send("Error interno de servidor");
    }    
});

ruta.get("/borrar/:id", async(req, res)=>{
    var usuario=await buscarPorID(req.params.id)
    if(usuario){
        var foto=usuario.foto;
        fs.unlinkSync(`web/images/${foto}`);
    await borrarUsuario(req.params.id);
    }
    res.redirect("/")
});

ruta.get("/login", (req, res)=>{
    res.render("usuarios/login");
});  

ruta. post ("/login", async(req, res)=>{
    var {usuario, password}=req.body;
    var usuarioEncontrado=await buscarPorUsuario(usuario);
    if (usuarioEncontrado) {
        var passwordCorrecto=await verificarPassword(password, usuarioEncontrado.password, usuarioEncontrado.salt);
        if (passwordCorrecto) {
            if (usuarioEncontrado.admin) {
                req.session.admin=usuarioEncontrado.admin;
                //res.redirect("/");
                res.redirect("/nuevoproducto");
            }else{
                req.session.usuario=usuarioEncontrado.usuario;
                res.redirect("/usuarios");
            }
        }else{
            console.log("Usuario o contraseña incorrectos");
            res.render("usuarios/login");
        }
    }else{
        console.log("Usuario o contraseña incorrectos");
        res.render("usuarios/login");
    }
});

ruta.get("/logout", (req, res)=>{
    req.session=null;
    res.redirect("/");
});

module.exports=ruta;