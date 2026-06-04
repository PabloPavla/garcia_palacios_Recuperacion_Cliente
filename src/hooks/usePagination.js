/**
 * @fileoverview Custom hook usePagination.
 * Abstrae la lógica de paginación para listados de títulos.
 * Usa react-query internamente para gestionar las peticiones.
 *
 * @module usePagination
 */
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook personalizado que abstrae la lógica de paginación.
 * Recibe una función de fetch y parámetros, y devuelve el estado
 * de la página actual junto con métodos de navegación.
 *
 * @param {Object} config - Configuración de la paginación
 * @param {string} config.queryKey - Clave base para react-query (identifica la query)
 * @param {Function} config.fetchFn - Función que realiza la petición. Recibe los params con page incluido
 * @param {Object} [config.params={}] - Parámetros adicionales para la petición
 * @param {number} [config.initialPage=1] - Página inicial
 *
 * @returns {Object} Estado y métodos de paginación
 * @returns {number} return.currentPage - Número de página actual
 * @returns {Array} return.items - Ítems de la página actual
 * @returns {number} return.totalResults - Número total de resultados
 * @returns {number} return.totalPages - Número total de páginas
 * @returns {Function} return.nextPage - Avanza a la siguiente página
 * @returns {Function} return.prevPage - Retrocede a la página anterior
 * @returns {Function} return.goToPage - Navega a una página específica
 * @returns {boolean} return.isLoading - Si la petición está en curso
 * @returns {boolean} return.isError - Si hubo un error
 * @returns {Error|null} return.error - Objeto de error si existe
 * @returns {boolean} return.hasNextPage - Si hay una página siguiente
 * @returns {boolean} return.hasPrevPage - Si hay una página anterior
 *
 * @example
 * const { items, currentPage, nextPage, prevPage, isLoading } = usePagination({
 *   queryKey: 'allTitles',
 *   fetchFn: getListTitles,
 *   params: { types: 'movie' },
 * });
 */
function usePagination({ queryKey, fetchFn, params = {}, initialPage = 1 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  /**
   * Query de react-query que se re-ejecuta cuando cambia la página o los parámetros.
   */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, currentPage, params],
    queryFn: () => fetchFn({ ...params, page: currentPage }),
    keepPreviousData: true,
  });

  /** Ítems de la página actual */
  const items = useMemo(() => data?.titles || [], [data]);

  /** Total de resultados disponibles */
  const totalResults = data?.total_results || 0;

  /** Total de páginas (asumiendo 250 resultados por página según la API de Watchmode) */
  const totalPages = data?.total_pages || Math.ceil(totalResults / 250) || 1;

  /** Si hay más páginas después de la actual */
  const hasNextPage = currentPage < totalPages;

  /** Si hay páginas antes de la actual */
  const hasPrevPage = currentPage > 1;

  /**
   * Avanza a la siguiente página.
   */
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  /**
   * Retrocede a la página anterior.
   */
  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  /**
   * Navega directamente a una página específica.
   *
   * @param {number} page - Número de la página a la que navegar
   */
  const goToPage = useCallback(
    (page) => {
      const pageNum = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNum);
    },
    [totalPages]
  );

  return {
    currentPage,
    items,
    totalResults,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    isLoading,
    isError,
    error,
    hasNextPage,
    hasPrevPage,
  };
}

export default usePagination;
