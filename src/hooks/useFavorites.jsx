/**
 * @fileoverview Context de favoritos.
 * Gestiona los favoritos del usuario usando localStorage
 * y comparte el estado entre todos los componentes mediante Context.
 *
 * @module FavoritesContext
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'watchmode_favorites';
const FavoritesContext = createContext();

/**
 * Lee los favoritos almacenados en localStorage.
 *
 * @returns {Array<number>} Array de IDs de títulos favoritos
 */
function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda los favoritos en localStorage.
 *
 * @param {Array<number>} favorites - Array de IDs a guardar
 */
function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Provider que envuelve la app y gestiona el estado global de favoritos.
 * Sincroniza automáticamente con localStorage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element}
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  /** Sincroniza el estado con localStorage cada vez que cambia */
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  /**
   * Añade un título a la lista de favoritos.
   *
   * @param {number} id - ID del título a añadir
   */
  const addFavorite = useCallback((id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  /**
   * Quita un título de la lista de favoritos.
   *
   * @param {number} id - ID del título a quitar
   */
  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  }, []);

  /**
   * Alterna un título en la lista de favoritos.
   * Si está, lo quita; si no está, lo añade.
   *
   * @param {number} id - ID del título a alternar
   */
  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favId) => favId !== id);
      }
      return [...prev, id];
    });
  }, []);

  /**
   * Comprueba si un título está en la lista de favoritos.
   *
   * @param {number} id - ID del título a comprobar
   * @returns {boolean} true si el título es favorito
   */
  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook para acceder al context de favoritos.
 * Debe usarse dentro de un FavoritesProvider.
 *
 * @returns {Object} Estado y métodos de favoritos
 * @returns {Array<number>} return.favorites - Lista de IDs de títulos favoritos
 * @returns {Function} return.addFavorite - Añade un ID a favoritos
 * @returns {Function} return.removeFavorite - Quita un ID de favoritos
 * @returns {Function} return.toggleFavorite - Alterna un ID en favoritos
 * @returns {Function} return.isFavorite - Comprueba si un ID está en favoritos
 * @returns {number} return.favoritesCount - Número total de favoritos
 *
 * @example
 * const { favorites, toggleFavorite, isFavorite } = useFavorites();
 */
function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
}

export default useFavorites;
