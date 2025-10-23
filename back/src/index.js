import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// === Endpoint simple ===
app.get('/valenti', (req, res) => {
  res.json({ nombre_completo: 'Montserrat Valenti' });
});

// === CRUD mesas ===

// CREATE
app.post('/mesas', async (req, res) => {
  try {
    const { nombre, capacidad, estado } = req.body;
    if (!nombre || !capacidad) {
      return res.status(400).json({ error: 'Nombre y capacidad son requeridos' });
    }
    const mesa = await prisma.mesa.create({
      data: {
        nombre,
        capacidad,
        estado: estado || 'disponible'
      }
    });
    res.status(201).json(mesa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ todas
app.get('/mesas', async (req, res) => {
  try {
    const mesas = await prisma.mesa.findMany({ orderBy: { id: 'desc' } });
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ por ID
app.get('/mesas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const mesa = await prisma.mesa.findUnique({ where: { id } });
    if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });
    res.json(mesa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put('/mesas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, capacidad, estado } = req.body;
    if (!nombre || !capacidad || !estado) {
      return res.status(400).json({ error: 'Nombre, capacidad y estado son requeridos' });
    }
    const mesa = await prisma.mesa.update({
      where: { id },
      data: { nombre, capacidad, estado }
    });
    res.json(mesa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete('/mesas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.mesa.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor API escuchando en el puerto ${PORT}`);
});
