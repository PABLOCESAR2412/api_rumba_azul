import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier dominio
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejo del preflight de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Manejo del método POST para agregar canciones
    if (req.method === 'POST') {
      const { titulo, artista, genero, duracion } = req.body;

      // Validación de datos
      if (!titulo || !artista || !genero || !duracion) {
        return res.status(400).json({ error: 'Faltan campos requeridos (nombre y artista)' });
      }

      // Crear canción en la base de datos
      const nuevaCancion = await prisma.cancion.create({
        data: {
          titulo, artista, genero, duracion
        },
      });

      // Respuesta exitosa
      return res.status(201).json(nuevaCancion);
    }

    // Manejo del método GET para obtener todas las canciones
    if (req.method === 'GET') {
      const canciones = await prisma.cancion.findMany();
      return res.status(200).json(canciones);
    }

    // Método no permitido
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en la API:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
