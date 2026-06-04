/**
 * @fileoverview Context para gestionar las plataformas de streaming
 * a las que está suscrito el usuario.
 *
 * Proporciona un Provider y un hook para acceder a las plataformas
 * seleccionadas desde cualquier componente.
 */
import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'watchmode_platforms';

/**
 * Context de plataformas del usuario.
 * @type {React.Context}
 */
const PlatformContext = createContext();

/**
 * Lee las plataformas almacenadas en localStorage.
 *
 * @returns {Array<Object>} Lista de plataformas seleccionadas
 */
function loadPlatforms() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda las plataformas en localStorage.
 *
 * @param {Array<Object>} platforms - Lista de plataformas a guardar
 */
function savePlatforms(platforms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms));
}

/**
 * Provider que envuelve la app y gestiona el estado de las plataformas suscritas.
 * Sincroniza la selección automáticamente con localStorage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element}
 */
export function PlatformProvider({ children }) {
  const [platforms, setPlatforms] = useState(loadPlatforms);

  /** Sincroniza el estado con localStorage cuando hay cambios */
  useEffect(() => {
    savePlatforms(platforms);
  }, [platforms]);

  return (
    <PlatformContext.Provider value={{ platforms, setPlatforms }}>
      {children}
    </PlatformContext.Provider>
  );
}

/**
 * Hook para acceder al context de plataformas.
 *
 * @returns {{ platforms: Array<Object>, setPlatforms: Function }} Estado y setter de plataformas
 */
export function usePlatforms() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatforms debe usarse dentro de un PlatformProvider');
  }
  return context;
}

export default PlatformContext;
