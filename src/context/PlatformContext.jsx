/**
 * @fileoverview Context para gestionar las plataformas de streaming
 * a las que está suscrito el usuario.
 *
 * Proporciona un Provider y un hook para acceder a las plataformas
 * seleccionadas desde cualquier componente.
 */
import { createContext, useContext, useState } from 'react';

/**
 * Context de plataformas del usuario.
 * @type {React.Context}
 */
const PlatformContext = createContext();

/**
 * Provider que envuelve la app y gestiona el estado de las plataformas suscritas.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element}
 */
export function PlatformProvider({ children }) {
  const [platforms, setPlatforms] = useState([]);

  // TODO: Implementar lógica de añadir/quitar plataformas

  return (
    <PlatformContext.Provider value={{ platforms, setPlatforms }}>
      {children}
    </PlatformContext.Provider>
  );
}

/**
 * Hook para acceder al context de plataformas.
 *
 * @returns {{ platforms: Array, setPlatforms: Function }}
 */
export function usePlatforms() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatforms debe usarse dentro de un PlatformProvider');
  }
  return context;
}

export default PlatformContext;
