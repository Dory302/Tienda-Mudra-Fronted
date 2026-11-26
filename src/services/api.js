const API_URL = "http://localhost:8080/api";

export function obtenerToken() {
  return localStorage.getItem("mudra_token");
}

export function obtenerRol() {
  return localStorage.getItem("mudra_rol");
}

export function cerrarSesion() {
  localStorage.removeItem("mudra_token");
  localStorage.removeItem("mudra_rol");
  localStorage.removeItem("mudra_usuario");
}

// 1. Iniciar sesión con JWT
export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Usuario o contraseña incorrectos");
  }

  localStorage.setItem("mudra_token", data.token);
  localStorage.setItem("mudra_rol", data.rol);
  localStorage.setItem("mudra_usuario", data.username);
  return data;
}

// 2. Obtener productos desde el backend (público)
export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) {
    throw new Error("No se pudieron cargar los productos desde el servidor");
  }
  return res.json();
}

// 3. Crear producto (requiere token de ROLE_ADMIN)
export async function crearProducto(producto) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });

  if (!res.ok) {
    throw new Error("No se pudo crear el producto (verifica que hayas iniciado sesión como ADMIN)");
  }
  return res.json();
}

// 4. Eliminar producto (requiere token de ROLE_ADMIN)
export async function eliminarProducto(id) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo eliminar el producto (requiere rol ADMIN)");
  }
}

// 5. Actualizar producto (requiere token de ROLE_ADMIN)
export async function actualizarProducto(id, producto) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });
  if (!res.ok) {
    throw new Error("No se pudo actualizar el producto (verifica que hayas iniciado sesión como ADMIN)");
  }
  return res.json();
}