var ruta = require("express").Router();
var fs=require("fs")
var { mostrarProductos, nuevoProducto, modificarProducto,
     buscarProductoPorID, borrarProducto } = require("../bd/productosBD");
var subirArchivo=require("../middlewares/subirArchivos");
const {admin}=require("../middlewares/funcionesPassword");

ruta.get("/productos", async (req, res) => {
    var productos = await mostrarProductos();
    res.render("productos/mostrar", { productos });
});

ruta.get("/nuevoproducto", admin, async (req, res) => {
    console.log("Llegué a /nuevoproducto");
    res.render("productos/nuevo");
});

ruta.post("/nuevoproducto", subirArchivo(), async (req, res) => {
   req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/productos");
});

ruta.get("/editarProducto/:id", async (req, res) => {
    var producto = await buscarProductoPorID(req.params.id);
    res.render("productos/modificar", { producto });
});

ruta.post("/editarProducto", subirArchivo(), async (req, res) => {
    try{
       const productoAct=await buscarProductoPorID(req.body.id);
        if(req.file){
            req.body.foto=req.file.originalname;
            if(productoAct.foto){
                const rutaFotoAnterior=`web/images/${productoAct.foto}`;
                fs.unlinkSync(rutaFotoAnterior);
            } }     
    var error = await modificarProducto(req.body);
    res.redirect("/productos");}
    catch(error){
        console.error("Error al editar producto", error);
        res.status(500).send("Error interno del servidor");
    }
});

ruta.get("/borrarProducto/:id", async (req, res) => {
    var producto=await borrarProducto(req.params.id)
    if(producto){
        var foto=producto.foto;
        fs.unlinkSync(`web/images/${foto}`);
        await borrarProducto(req.params.id);
    }
    res.redirect("/productos");
});

module.exports = ruta;