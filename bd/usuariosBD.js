// var conexion=require("./conexion").conexion;
var conexion=require("./conexion").conexion;
var Usuario=require("../modelos/Usuarios");
var crypto=require("crypto")
var {encriptarPassword}=require("../middlewares/funcionesPassword")

async function mostrarUsuarios(){
    var users=[];
    try{
    var usuarios=await conexion.get();
    usuarios.forEach((usuario) => {
        var user=new Usuario(usuario.id, usuario.data());
          if (user.bandera == 0){
            users.push(user.obtenerDatos);
        }        
    });
  }
  catch(err){
    console.log("Error al recuperar usuarios de la BD"+err);
  }
    return users;
}

  async function buscarPorID(id){
    var user="";
    console.log(id);
    try{
        var usuario=await conexion.doc(id).get();
        var usuarioObjeto=new Usuario(usuario.id, usuario.data());
        if(usuarioObjeto.bandera==0){
            user=usuarioObjeto.obtenerDatos;
        }
    }
    catch(err){
        console.log("Error al recurperar al usuario"+err);
    }
    return user;
  }

  async function nuevoUsuario(datos){
    var {hash, salt}=encriptarPassword(datos.password);
    datos.password=hash;
    datos.salt=salt;

    // Agregar la información de si es administrador o no
    datos.admin = datos.tipoUsuario === 'admin';
    
    var user=new Usuario(null, datos);
    console.log(user);
    var error=1;
    if (user.bandera==0){
        try{
            //console.log(user.obtenerDatos);
            await conexion.doc().set(user.obtenerDatos);
            console.log("Usuario insertado a la BD");
            error=0;
        }
        catch(err){
            console.log("Error al capturar el nuevo usuario"+err);
        }
    }
    return error;
  }
  
  async function modificaUsuario(datos){
    var error=1;
    var respuestaBuscar=await buscarPorID(datos.id);
    if (respuestaBuscar!=undefined){
      if (datos.password=="") {
        datos.password=datos.passwordViejo;
        datos.salt=datos.saltViejo;
      }else{
        var{salt, hash}=encriptarPassword(datos.password);
        datos.password=hash;
        datos.salt=salt;
      }
    var user=new Usuario(datos.id, datos);
    var error=1;
    if (user.bandera==0){
        try{
            await conexion.doc(user.id).set(user.obtenerDatos);
            console.log("Registro actualizado ");
            error=0;
        }
        catch(err){
            console.log("Error al modificar al usuario"+err);
        }
    }
  }
    return error;
  }

  async function borrarUsuario(id){
    var error=1;
    var user=await buscarPorID(id);
    if(user!=""){
    try{
        await conexion.doc(id).delete();
        console.log("Registro borrado ");
        error=0;
    }
    catch(err){
        console.log("Error al borrar usuario "+err);
    }
  }
  return error;
}

async function buscarPorUsuario(usuario){
  var user="";
  try{
    var usuarios=await conexion.where("usuario", "==", usuario).get();
    usuarios.forEach((usuario)=>{
      var usuarioObjeto= new Usuario(usuario.id, usuario.data());
      if (usuarioObjeto.bandera==0) {
        user=usuarioObjeto.obtenerDatos;
      }
    });
  }catch(err){
    console.log("Error al recuperar usuario"+err);
  }
  return user;
}

async function verificarPassword(password, hash, salt){
  var hashEvaluar=crypto.scryptSync(password,salt,100000,64, 'sha512').toString('hex');
  return hashEvaluar === hash;      
}


  module.exports={
    mostrarUsuarios,
    buscarPorID,
    nuevoUsuario,
    modificaUsuario,
    borrarUsuario,
    buscarPorUsuario,
    verificarPassword
  };

