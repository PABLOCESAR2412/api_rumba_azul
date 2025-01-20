'use client';

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
  const [loading, setLoading] = useState(false);

  // Obtener canciones al cargar la página
  useEffect(() => {
    async function fetchCanciones() {
      setLoading(true);
      const res = await fetch('/api/repertorio');
      const data = await res.json();
      setCanciones(data);
      setLoading(false);
    }
    fetchCanciones();
  }, []);

  // Agregar canción
  const agregarCancion = async () => {
    if (!nuevaCancion.titulo || !nuevaCancion.artista || !nuevaCancion.genero || nuevaCancion.duracion <= 0) {
      alert('Todos los campos son obligatorios y la duración debe ser mayor a 0');
      return;
    }

    const res = await fetch('/api/repertorio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCancion),
    });

    if (res.ok) {
      const data = await res.json();
      setCanciones((prev) => [...prev, data]);
      setNuevaCancion({ titulo: '', artista: '', genero: '', duracion: 0 });
    } else {
      alert('Error al agregar la canción');
    }
  };

  // Eliminar canción
  const eliminarCancion = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar esta canción?')) {
      const res = await fetch('/api/repertorio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setCanciones(canciones.filter((cancion) => cancion.id !== id));
      } else {
        alert('Error al eliminar la canción');
      }
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Repertorio de Canciones</h1>

      {loading ? (
        <p className="text-center mt-4">Cargando...</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {canciones.map((cancion) => (
            <li key={cancion.id} className="p-4 border rounded-lg shadow-md bg-gray-100 flex justify-between">
              <div>
                <strong>{cancion.titulo}</strong> - {cancion.artista} ({cancion.genero}) - {cancion.duracion} seg
              </div>
              <button
                onClick={() => eliminarCancion(cancion.id)}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 bg-gray-200 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Agregar Nueva Canción</h2>
        <input
          type="text"
          placeholder="Título"
          value={nuevaCancion.titulo}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, titulo: e.target.value })}
          className="block w-full p-2 border rounded mt-2"
        />
        <input
          type="text"
          placeholder="Artista"
          value={nuevaCancion.artista}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, artista: e.target.value })}
          className="block w-full p-2 border rounded mt-2"
        />
        <input
          type="text"
          placeholder="Género"
          value={nuevaCancion.genero}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, genero: e.target.value })}
          className="block w-full p-2 border rounded mt-2"
        />
        <input
          type="number"
          placeholder="Duración (segundos)"
          value={nuevaCancion.duracion}
          onChange={(e) => setNuevaCancion({ ...nuevaCancion, duracion: parseInt(e.target.value, 10) || 0 })}
          className="block w-full p-2 border rounded mt-2"
        />
        <button
          onClick={agregarCancion}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Agregar Canción
        </button>
      </div>
    </div>
  );
}
