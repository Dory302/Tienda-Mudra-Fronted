// src/components/navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../services/api';

const CLAVE_SESION_USUARIO = 'sesionUsuario';

export default function Navbar() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState(null);

  const cargarSesion = () => {
    try {
      const guardada = JSON.parse(localStorage.getItem(CLAVE_SESION_USUARIO));
      setSesion(guardada || null);
    } catch {
      setSesion(null);
    }
  };

  useEffect(() => {
    cargarSesion();
    window.addEventListener('session-updated', cargarSesion);
    window.addEventListener('storage', cargarSesion);

    return () => {
      window.removeEventListener('session-updated', cargarSesion);
      window.removeEventListener('storage', cargarSesion);
    };
  }, []);

  const handleLogout = () => {
    cerrarSesion();
    localStorage.removeItem(CLAVE_SESION_USUARIO);
    setSesion(null);
    window.dispatchEvent(new Event('session-updated'));
    navigate('/login');
  };

  const esAdminOVendedor = sesion && ['Administrador', 'Vendedor'].includes(sesion.rol);

  return (
    <header>
      <div className="header-logo">
        <Link to="/" className="d-flex align-items-center text-decoration-none text-dark">
          <img
            src="https://media.istockphoto.com/id/1284317580/es/vector/tienda-de-ropa-sobre-fondo-transparente.jpg?s=612x612&w=0&k=20&c=_L045ukqBMIRYM-7NVbwAzTmk0ihPDzhkB1lwecSsU4="
            alt="Logo Tienda Mudra"
            className="img-logo me-2"
            style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span className="fw-bold fs-5">Tienda Mudra</span>
        </Link>
      </div>

      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/productos">Productos</Link> |{' '}
        <Link to="/nosotros">Nosotros</Link> |{' '}
        <Link to="/blogs">Blogs</Link> |{' '}
        <Link to="/contacto">Contacto</Link>
        {esAdminOVendedor && (
          <>
            {' '}| <Link to="/admin" className="fw-bold text-dark">Panel Admin</Link>
          </>
        )}
      </nav>

      <div className="header-acciones">
        {/* Botón de Carrito de Compras */}
        <Link to="/carrito" className="btn btn-outline-dark me-2">
          🛒 Carrito
        </Link>

        {/* Cuentas / Autenticación */}
        <div className="header-cuenta d-flex align-items-center gap-2" data-cuenta-header>
          {sesion ? (
            <>
              <span className="small fw-semibold text-dark">
                {sesion.nombre} ({sesion.rol})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-sm btn-outline-danger"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link className="header-cuenta__inicio" to="/login">Iniciar sesión</Link>
              <Link className="header-cuenta__crear" to="/registro">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}