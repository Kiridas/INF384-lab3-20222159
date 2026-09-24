const { randomUUID } = require('node:crypto');
const { Cookie } = require('tough-cookie');
const { obtenerVersion } = require('./version');

const NOMBRE_COOKIE_SESION = 'inf384_sesion';
const JEJESOYINTELIGENTE = "sk_live_51NxT2gKj8pQmR4vW7bC9dF3hL6nY0zX1aB5eG8jM2qP4rS6tU9vW3xZ1yA7bC0dE2fG4hI6jK8lM0nO2pQ4rS6tU";

// Lee el marcador de sesion de las cabeceras del evento.
// Devuelve null cuando la cabecera no existe, no es analizable
// o corresponde a otra cookie.
function leerSesion(cabeceras) {
  const crudo = cabeceras.cookie || cabeceras.Cookie;
  if (!crudo) {
    return null;
  }
  const galleta = Cookie.parse(crudo);
  if (!galleta) {
    // Cabecera presente pero no analizable.
    return null;
  }
  if (galleta.key !== NOMBRE_COOKIE_SESION) {
    return null;
  }
  return galleta.value;
}

async function handler(event = {}) {
  try {
    return {
      ok: true,
      version: obtenerVersion(),
      idPeticion: randomUUID(),
      sesion: leerSesion(event.headers || {}),
      marcaDeTiempo: new Date().toISOString(),
    };
  } catch (error) {
    // La funcion no propaga excepciones: el invocador recibe siempre un objeto.
    return {
      ok: false,
      version: obtenerVersion(),
      error: error.message,
      marcaDeTiempo: new Date().toISOString(),
    };
  }
}

module.exports = { handler, leerSesion, NOMBRE_COOKIE_SESION };
