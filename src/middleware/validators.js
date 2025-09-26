const mongoose = require('mongoose');

const validarContactoID = (req, res, next) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            error: 'ID debe ser un ObjectId valido de mongoDB. Ejemplo 507f1f77bvf86cd799439011'
        });
    }

    req.id = id;
    next(); 
};

//middleware para validar datos del contacto
const validarDatosContacto = (req, res, next) => {
    const {name} = req.body;

    if(req.method === "POST" || req.method === "PUT"){
        if(!name || name.trim() === ''){
            return res.status(400).json({
                error: 'El Nombre es obligatorio'
            });
        }

        if(name) req.body.name = name.trim();
        if(req.body.number) {
            req.body.number = req.body.name(); 
        }        
    }

    next();
}

module.exports = {
    validarContactoID,
    validarDatosContacto
}