import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const canciones = await prisma.cancion.findMany();
    return res.status(200).json(canciones);
  }

  if (req.method === 'POST') {
    const { titulo, artista, genero, duracion } = req.body;

    if (!titulo || !artista || !genero || !duracion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const nuevaCancion = await prisma.cancion.create({
      data: { titulo, artista, genero, duracion },
    });

    return res.status(201).json(nuevaCancion);
  }

  

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Método ${req.method} no permitido`);
}
