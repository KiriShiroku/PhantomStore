var ruta=require("express").Router();
//const { json } = require("express");
var{ mostrarProductos, nuevoProducto, modificarProducto,
     borrarProducto, buscarProductoPorID }=require("../bd/productosBD");
var subirArchivo=require("../middlewares/subirArchivos");
var fs=require("fs");


ruta.get("/api/mostrarProductos", async(req, res)=>{
    var productos=await mostrarProductos();
    if(productos.length>0)
    res.status(200).json(productos);
else
res.status(400).json("No hay productos");
});

ruta.post("/api/nuevoproductoN", subirArchivo(), async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoProducto(req.body);
    if(error==0){
        res.status(200).json("Producto registrado");
    }else{
        res.status(400).json("Datos incorrectos");
    }
});

ruta.get("/api/productos/buscarProductoPorID/:id", async(req, res)=>{
    var product=await buscarProductoPorID(req.params.id);
    if (product=="") {
        res.status(400).json("Producto no encontrado");
    }else{
        res.status(200).json(product);
    }
});

ruta.post("/api/editarProductoN", subirArchivo(), async(req, res)=>{
    try{
        const productoAct=await buscarProductoPorID(req.body.id);
        if(req.file){
            req.body.foto=req.file.originalname;
            if (productoAct.foto) {
                const rutaFotoAnterior=`web/images/${productoAct.foto}`;
                fs.unlinkSync(rutaFotoAnterior);
            }
        }
    var error=await modificarProducto(req.body);
    if(error==0){
        res.status(200).json("Producto actualizado");
    }
    else{
        res.status(400).json("Error al actulizar el producto")
    }}
    catch(error){
        console.error("Error al editar producto", error);
        res.status(500).send("Error interno del servidor");
    }
});

ruta.get("/api/borrarProductoN/:id", async (req, res)=>{
    try{
        var producto=await borrarProducto(req.params.id)
        if(producto){
            var foto=producto.foto;
            fs.unlinkSync(`web/images/${foto}`);
            var error=await borrarProducto(req.params.id);
        }
        if(error==0){
            res.status(200).json("Producto borrado");
    }
    else{
        res.status(400).json("Error al borrar el producto");
    } }
    catch(error){
        console.error("Error al borrar el producto", error);
        res.status(500).json("Error interno del servidor");
    }    
});

module.exports=ruta;