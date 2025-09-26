const express = require('express');
const router = express.Router();

//Importar los controladores
const{
    getContacts, 
    getContactById, 
    createContact, 
    updateContact, 
    deleteContact
} = require('../controllers/agendaControllers')

const{
    validarContactoID,
    validarDatosContacto,
} = require('../middleware/validators');

//Ruta GET /API/Contactos
router.get('/',getContacts);

//Ruta GET /API/Contactos:id
router.get('/:id',validarContactoID,getContactById);

//Ruta POST /API/Contactos
router.post('/',validarDatosContacto, createContact);

//Ruta PUT /API/Contactos/:id
router.put('/:id',validarContactoID, validarDatosContacto, updateContact);

router.delete('/:id',validarContactoID, deleteContact);

module.exports = router