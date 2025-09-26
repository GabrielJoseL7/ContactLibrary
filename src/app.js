const express = require('express');
const path = require('path');
//Para instalar Cors = npm install cors
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//Importar conexion de mongoDB
const {conectarDB }= require('./data/agendaData');

//Conectar a base de datos
conectarDB(); 

app.use(express.static(path.join(__dirname,'../public')));

app.use(cors());
app.use(express.json());

const agendaRoutes = require('./routes/agendaRoutes');

//Configuracion de las rutas
app.use('/api/contactos',agendaRoutes);

app.listen(PORT, () => {
    console.log('Servidor ejecutando Agenda De Contactos DB');
})