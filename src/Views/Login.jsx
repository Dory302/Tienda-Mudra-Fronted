// src/Views/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const CLAVE_SESION_USUARIO = "sesionUsuario";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });

  const [errores, setErrores] = useState({
    correo: '',
    contrasena: ''
  });

  const [estadoLogin, setEstadoLogin] = useState({
    mensaje: '',
    tipo: ''
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'correo') {
      setErrores((prev) => ({
        ...prev,
        correo: value.trim() ? '' : 'Ingresa tu usuario o correo.'
      }));
    }

    if (name === 'contrasena') {
      const len = value.length;
      setErrores((prev) => ({
        ...prev,
        contrasena: (len >= 4 && len <= 20) ? '' : 'La contraseña debe tener entre 4 y 20 caracteres.'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entrada = formData.correo.trim().toLowerCase();
    const pass = formData.contrasena;

    if (!entrada || pass.length < 4) {
      setErrores({
        correo: entrada ? '' : 'Ingresa tu usuario o correo.',
        contrasena: pass.length >= 4 ? '' : 'La contraseña debe tener al menos 4 caracteres.'
      });
      return;
    }

    // Compatibilidad: si escribe admin@duoc.cl o cliente@duoc.cl, toma el username antes del @
    const usernameBackend = entrada.includes('@') ? entrada.split('@')[0] : entrada;

    try {
      setCargando(true);
      setEstadoLogin({ mensaje: '', tipo: '' });

      // Llamada real al backend Spring Boot (POST /api/auth/login) -> guarda mudra_token y mudra_rol
      const data = await login(usernameBackend, pass);

      const esAdmin = data.rol === 'ROLE_ADMIN';

      // Guardamos también sesionUsuario para mantener compatibilidad con Navbar y rutas protegidas
      const sesion = {
        run: esAdmin ? '123456785' : '111111111',
        rol: esAdmin ? 'Administrador' : 'Cliente',
        nombre: data.username,
        apellidos: '',
        correo: entrada.includes('@') ? entrada : `${data.username}@duoc.cl`,
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        direccion: 'Santiago, Chile'
      };

      localStorage.setItem(CLAVE_SESION_USUARIO, JSON.stringify(sesion));
      window.dispatchEvent(new Event('session-updated'));

      if (esAdmin) {
        navigate('/admin');
      } else {
        navigate('/productos');
      }
    } catch (err) {
      setEstadoLogin({
        mensaje: err.message || 'Usuario o contraseña incorrectos en el servidor.',
        tipo: 'error'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="text-center mb-4">
            <span className="badge bg-secondary mb-2">Cuenta de cliente</span>
            <h1 className="fw-bold">Inicia sesión</h1>
            <p className="text-muted">
              Accede con tu usuario y contraseña. ¿Aún no tienes cuenta?{' '}
              <Link to="/registro">Regístrate</Link>
            </p>
          </div>

          <div className="card shadow-sm p-4">
            <h2 className="h5 fw-bold mb-3 border-bottom pb-2">Ingreso al sistema</h2>

            {estadoLogin.mensaje && (
              <div className={`alert ${estadoLogin.tipo === 'error' ? 'alert-danger' : 'alert-success'} mb-3`}>
                {estadoLogin.mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Usuario o Correo</label>
                <input
                  type="text"
                  name="correo"
                  className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="ej. admin o admin@duoc.cl"
                  required
                />
                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  className={`form-control ${errores.contrasena ? 'is-invalid' : ''}`}
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                {errores.contrasena && <div className="invalid-feedback">{errores.contrasena}</div>}
              </div>

              <button type="submit" className="btn btn-dark w-100 btn-lg" disabled={cargando}>
                {cargando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <div className="bg-light p-3 rounded mt-4 text-center small text-muted">
              <strong>Credenciales Backend (JWT):</strong><br />
              Admin: <code>admin</code> / <code>admin123</code><br />
              Cliente: <code>user</code> / <code>user123</code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}