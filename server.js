const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://cesaraugustosimancasariza_db_user:Cesar-123@clustel.stynmjk.mongodb.net/hoja_de_vida?retryWrites=true&w=majority';

// Esquema y Modelo de MongoDB para Experiencia Profesional
const experienciaSchema = new mongoose.Schema({
    empresa: { type: String, required: true },
    puesto: { type: String, required: true },
    fechaInicio: { type: String, required: true },
    fechaFin: { type: String, default: 'Presente' },
    descripcion: { type: String, required: true }
});

const Experiencia = mongoose.model('Experiencia', experienciaSchema);

// --- RUTAS DE LA API (CRUD) ---

// 1. GET: Obtener todas las experiencias
app.get('/api/experiencias', async (req, res) => {
    try {
        const experiencias = await Experiencia.find();
        res.json(experiencias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los registros' });
    }
});

// 2. POST: Crear una nueva experiencia
app.post('/api/experiencias', async (req, res) => {
    try {
        const nuevaExp = new Experiencia(req.body);
        await nuevaExp.save();
        res.status(201).json(nuevaExp);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el registro' });
    }
});

// 3. PUT: Actualizar una experiencia por ID
app.put('/api/experiencias/:id', async (req, res) => {
    try {
        const expActualizada = await Experiencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(expActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el registro' });
    }
});

// 4. DELETE: Eliminar una experiencia por ID
app.delete('/api/experiencias/:id', async (req, res) => {
    try {
        await Experiencia.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Experiencia eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el registro' });
    }
});

// Conexión a la base de datos e inicio del servidor
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión exitosa a MongoDB Atlas');
        app.listen(PORT, () => console.log(`Servidor de la API corriendo en el puerto ${PORT}`));
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));