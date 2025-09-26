const mongo = require('mongoose');

const agendaSchema  = new mongo.Schema({
    firstName:{type: String, required: true, minlength: 3},
    lastName:{type: String, required: true},
    phoneNumber:{type: String, required:true, match: [/^(\+502\s?)?[2-6]\d{7}$/]},
    email:{type: String, required: false, match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/]},
    saved:{type: Boolean, default: false},
    dateCreate:{type:Date, default: Date.now},
    dateUpdate:{type:Date, default: Date.now},
});

const contactos = mongo.model('Contactos', agendaSchema);

const conectarDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_CONEXION;
        await mongo.connect(MONGODB_URI, {
            dbName: process.env.DB_NAME
        });

        console.log('Conectado a MongoDB Atlas');
    }
    catch(error){
        console.error()
    }
};

//Funcion para obtener todos los contactos
const obtenerTodosLosContactos = async () => {
    try {
        return await contactos.find().sort({dateCreation:-1});
    }
    catch(error){
        console.error('Error obteniendo los contactos  ', error.message);
    }
};

//Funcion para obtener todos los contactos por ID
const obtenerContactoPorId = async () => {
    try{
        return await contactos.findById(Id);
    }
    catch(error){
        console.error('Error obteniendo el contacto por Id: ', error.message);
    }
};

//Funcion pora crear nueva tarea
const crearContacto = async (contactosData) => {
    try{
        const nuevoContacto = new contactos(contactosData);
        return await nuevoContacto.save();
    }
    catch(error){
        console.error('Error creando tarea: ', error.message);
    }
};

// Funcion para actualizarContacto
const actualizarContacto = async (id, nuevosDatos) => {
    try {
        return await contactos.findByIdAndUpdate(
            id, 
            {
                ...nuevosDatos, dateUpdate: new Date()
            }
        );
    }
    catch(error){
        console.error('Error actualizando la tarea: ', error.message);
    }
};

const eliminarContacto = async (id) => {
    try {
        return await contactos.findByIdAndDelete(id);
    }
    catch(error){
        console.error('Error eliminando tareas: ', error.message);
    }
};

//Exportar modules
module.exports = {
    conectarDB,
    contactos, 
    obtenerTodosLosContactos,
    obtenerContactoPorId,
    crearContacto, 
    actualizarContacto, 
    eliminarContacto
}