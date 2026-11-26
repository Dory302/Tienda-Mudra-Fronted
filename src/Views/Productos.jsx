// src/Views/Productos.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductos } from '../services/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductos()
      .then((data) => {
        setProductos(data);
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los productos desde el servidor.');
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const productosFiltrados = productos.filter((prod) => {
    const coincideNombre = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    let coincideCategoria = true;
    if (categoria !== 'Todas') {
      const catBusqueda = categoria.toLowerCase();
      const catProd = (prod.categoria || '').toLowerCase();
      const nombreProd = prod.nombre.toLowerCase();
      
      coincideCategoria = catProd.includes(catBusqueda) || nombreProd.includes(catBusqueda.slice(0, -2));
    }

    return coincideNombre && coincideCategoria;
  });

  return (
    <div className="container my-5" style={{ minHeight: '70vh' }}>
      <div className="text-center mb-4">
        <span className="text-uppercase text-muted small fw-bold">Catálogo Completo</span>
        <h2 className="fw-bold">Nuestros Productos</h2>
      </div>

      {/* Buscador y Filtro de Categorías */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre (ej. Polerón, Pantalón)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            <option value="Polerones">Polerones</option>
            <option value="Poleras">Poleras</option>
            <option value="Pantalones">Pantalones</option>
            <option value="Accesorios">Accesorios</option>
          </select>
        </div>
      </div>

      {/* Grilla de Productos */}
      <div className="row g-4">
        {cargando ? (
          <div className="col-12 text-center my-5">
            <p className="text-muted">Cargando productos desde el servidor...</p>
          </div>
        ) : error ? (
          <div className="col-12 text-center my-5">
            <div className="alert alert-danger py-4">
              <p className="mb-0">{error}</p>
            </div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="col-12 text-center my-5">
            <div className="alert alert-warning py-4">
              <p className="mb-0">No se encontraron productos para la categoría seleccionada.</p>
            </div>
          </div>
        ) : (
          productosFiltrados.map((prod) => (
            <div key={prod.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <img
                  src={prod.imagen || prod.img}
                  alt={prod.nombre}
                  className="card-img-top"
                  style={{ height: '240px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="card-title fw-bold text-dark mb-1">{prod.nombre}</h6>
                    <small className="text-muted d-block mb-1">Stock: {prod.stock} un.</small>
                    <span className="badge bg-light text-dark border mb-2">
                      {prod.categoria || 'Urbano'}
                    </span>
                    <h5 className="text-success fw-bold">
                      ${Number(prod.precio).toLocaleString('es-CL')}
                    </h5>
                  </div>
                  <Link
                    to={`/productos/${prod.id}`}
                    className="btn btn-dark w-100 mt-3 text-white fw-semibold"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}