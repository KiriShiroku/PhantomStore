class Producto {
    constructor(id, data) {
        this.bandera = 0;
        this.id = id;
        this.nombre = data.nombre;
        this.stock = data.stock;
        this.precio = data.precio;
       // this.desc = data.desc;
        this.foto = data.foto;
    }

    set id(id) {
        if (id != null)
            id.length > 0 ? this._id = id : this.bandera = 1;
    }

    set nombre(nombre) {
        nombre.length > 0 ? this._nombre = nombre : this.bandera = 1;
    }

    set stock(stock) {
        stock.length > 0 ? this._stock = stock : this.bandera = 1;
    }

    set precio(precio) {
        precio.length > 0 ? this._precio = precio : this.bandera = 1;
    }

    /*set desc(desc){
        desc.length >= 0 ? this._desc = desc : this.bandera = 1;
    }*/

    set foto(foto){
        if (foto != null)
        foto.length >0 ? this._foto = foto : this.bandera = 1;
    }

    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get stock() {
        return this._stock;
    }

    get precio() {
        return this._precio;
    }

   /* get desc() {
        return this._desc;
    }*/

    get foto(){
        return this._foto;
    }

    obtenerDatosP() {
        if (this._id != null)
            return {
                id: this.id,
                nombre: this.nombre,
                stock: this.stock,
                precio: this.precio,
                //desc: this.desc,
                foto: this.foto,
            };
        else {
            return {
                nombre: this.nombre,
                stock: this.stock,
                precio: this.precio,
                //desc: this.desc,
                foto: this.foto,
            };
        }
    }
}

module.exports = Producto;