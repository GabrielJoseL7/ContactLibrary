const {
    obtenerTodosLosContactos,
    obtenerContactoPorId,
    crearContacto,
    actualizarContacto,
    eliminarContacto,
} = require('../data/agendaData');

//Controller for all contacts
const getContacts = async (req, res) => {
    try {
        const { saved } = req.query;
        let contactos = await obtenerTodosLosContactos();

        if (saved !== undefined) {
            const isSaved = saved === 'true';
            contactos = contactos.filter(contacto => contacto.saved === isSaved);
        }

        res.json({
            count: contactos.length,
            contactos: contactos
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener todos los contactos" });
    }
};

//Controller to obtain contacts by ID
const getContactById = async (req, res) => {
    try {
        const contacto = await obtenerContactoPorId(req.params.id);

        if (!contacto) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        res.json(contacto);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el contacto" });
    }
};

//Controller to create a new contact
const createContact = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, saved } = req.body;

        const newContact = await crearContacto({
            // CORRECCIÓN CLAVE 2: Usar las variables extraídas y sanitizarlas.
            firstName: firstName ? firstName.trim() : undefined,
            lastName: lastName ? lastName.trim() : undefined,
            phoneNumber: phoneNumber ? phoneNumber.trim() : undefined, // Usar phoneNumber, no number
            email: email ? email.trim() : undefined,
            saved: saved || false
        });

        res.status(201).json({
            message: 'Contacto Guardado Exitosamente!',
            contacto: newContact
        });
    } catch (error) {
        // Es buena práctica loguear el error para debug.
        console.error("Error detallado al crear contacto:", error); 
        res.status(500).json({ error: 'Error al crear el contacto' });
    }
};

//Update a contact (PUT)
const updateContact = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, saved } = req.body;

        const actualizarAgenda = await actualizarContacto(req.params.id, {
            firstName: firstName ? firstName.trim() : undefined,
            lastName: lastName ? lastName.trim() : undefined,
            phoneNumber: phoneNumber ? phoneNumber.trim() : undefined, // Usar phoneNumber
            email: email ? email.trim() : undefined,
            saved: saved !== undefined ? saved : undefined
        });

        if (!actualizarAgenda) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        res.json({
            message: 'Contacto Actualizado Exitosamente!',
            contacto: actualizarAgenda
        });
    } catch (error) {
        console.error("Error detallado al actualizar contacto:", error);
        res.status(500).json({ error: 'Error al actualizar contacto' });
    }
};

//Delete a contact
const deleteContact = async (req, res) => {
    try {
        const contactoEliminado = await eliminarContacto(req.params.id);

        if (!contactoEliminado) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        res.json({
            message: 'Contacto eliminado exitosamente!',
            contacto: contactoEliminado
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el contacto' });
    }
};

module.exports = {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};