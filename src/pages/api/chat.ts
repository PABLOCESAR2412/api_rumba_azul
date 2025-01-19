import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nombre, telefono, email, mensaje } = req.body;

    if (!nombre || !telefono || !email || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    let respuesta = 'Lo siento, no entendí tu mensaje.';
    if (mensaje.toLowerCase().includes('repertorio')) {
      const canciones = await prisma.cancion.findMany();
      respuesta = canciones
        .map((c) => `${c.titulo} - ${c.artista} (${c.genero})`)
        .join('\n');
    }

    await prisma.mensaje.create({ data: { nombre, telefono, email, contenido: mensaje, tipo: 'usuario' } });
    await prisma.mensaje.create({ data: { nombre: 'Asistente', telefono: '', email: '', contenido: respuesta, tipo: 'asistente' } });

    return res.status(200).json({ respuesta });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Método ${req.method} no permitido`);
}
