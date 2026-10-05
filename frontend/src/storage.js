function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // El navegador bloqueó el almacenamiento de este sitio.
  }
}

export const storage = { read, write, remove };
