var express=require ("express");
var cors=require("cors");
var path=require("path");
// var session=require("express-session");
var session=require("cookie-session");
require("dotenv").config();
var rutas=require("./rutas/usuariosRutas");
var rutasp=require("./rutas/productosRutas");
var rutasUsuariosApi=require("./rutas/usuariosRutasApis");
var rutasProductosApi=require("./rutas/productosRutasApis");

var app=express();
app.set("view engine", "ejs");
app.use(cors());
//app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name:'session',
    keys:['qwertyuiop'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use("/", express.static(path.join(__dirname,"/web")));
app.use("/",rutas);
app.use("/", rutasp);
app.use("/",rutasUsuariosApi);
app.use("/",rutasProductosApi);

var port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);

});