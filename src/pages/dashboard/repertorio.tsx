'use client'

import { useState, useEffect } from 'react';

type Cancion = {
  id: number;
  titulo: string;
  artista: string;
  genero: string;
  duracion: number;
};

export default function Repertorio() {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [nuevaCancion, setNuevaCancion] = useState<Omit<Cancion, 'id'>>({
    titulo: '',
    artista: '',
    genero: '',
    duracion: 0,
  });

  // Obtener canciones al cargar
  useEffect(() => {
    async function fetchCanciones() {
      const res = await fetch('/api/repertorio');
      const data = await res.json();
      setCanciones(data);
    }
    fetchCanciones();
  }, []);

  const agregarCancion = async () => {
    if (!nuevaCancion.titulo || !nuevaCancion.artista || !nuevaCancion.genero || nuevaCancion.duracion <= 0) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const res = await fetch('/api/repertorio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCancion),
    });
    const data = await res.json();
    setCanciones((prev) => [...prev, data]);
    setNuevaCancion({ titulo: '', artista: '', genero: '', duracion: 0 });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex flex-col items-center">Repertorio de Canciones</h1>
      <ul className="mt-4">
        {canciones.map((cancion) => (
          <li key={cancion.id} className="border-b py-2">
            <strong>{cancion.titulo}</strong> - {cancion.artista} ({cancion.genero})
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Agregar Canción</h2>
        <input
          type="text"
          placeholder="Título"
          value={nuevaCancion.titulo}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, titulo: e.target.value })}
          className="block mt-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Artista"
          value={nuevaCancion.artista}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, artista: e.target.value })}
          className="block mt-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Género"
          value={nuevaCancion.genero}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, genero: e.target.value })}
          className="block mt-2 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Duración (segundos)"
          value={nuevaCancion.duracion}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, duracion: parseInt(e.target.value, 10) || 0 })}
          className="block mt-2 p-2 border rounded"
        />
        <button onClick={agregarCancion} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Agregar
        </button>
      </div>
    </div>
  );
}
