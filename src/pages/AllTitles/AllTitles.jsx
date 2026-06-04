/**
 * @fileoverview Página de listado completo de títulos (AllTitles).
 * Ruta: /all
 * Muestra un listado paginado de todos los títulos disponibles.
 * Utiliza el hook usePagination para la navegación entre páginas.
 *
 * @component
 * @returns {JSX.Element}
 */
import { getListTitles } from '../../api/watchmode';
import usePagination from '../../hooks/usePagination';
import GetMediaCard from '../../components/GetMediaCard/GetMediaCard';
import './AllTitles.css';

/**
 * Componente de página AllTitles.
 * Muestra una vista de catálogo de títulos paginada utilizando el hook usePagination.
 *
 * @component
 * @returns {JSX.Element} Vista del catálogo completo
 */
function AllTitles() {
  const {
    items,
    currentPage,
    totalPages,
    totalResults,
    nextPage,
    prevPage,
    goToPage,
    isLoading,
    isError,
    error,
    hasNextPage,
    hasPrevPage,
  } = usePagination({
    queryKey: 'allTitles',
    fetchFn: getListTitles,
    params: { types: 'movie,tv_series' },
  });

  return (
    <div className="alltitles-page">
      <h1 className="alltitles__title">Catálogo Completo</h1>
      <p className="alltitles__subtitle">
        Explora todos los títulos disponibles
        {totalResults > 0 && ` · ${totalResults.toLocaleString()} resultados`}
      </p>

      {/* Loading */}
      {isLoading && (
        <div className="alltitles__loading">
          <div className="alltitles__spinner"></div>
          <p>Cargando títulos...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="alltitles__error">
          ❌ Error al cargar los títulos: {error?.message}
        </p>
      )}

      {/* Grid de tarjetas */}
      {!isLoading && items.length > 0 && (
        <div className="alltitles__grid">
          {items.map((item) => (
            <GetMediaCard
              key={item.id}
              id={item.id}
              title={item.title}
              year={item.year}
              type={item.type}
              image={item.poster}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {!isLoading && items.length > 0 && (
        <nav className="alltitles__pagination" aria-label="Paginación">
          <button
            className="alltitles__page-btn"
            onClick={prevPage}
            disabled={!hasPrevPage}
          >
            ← Anterior
          </button>

          <div className="alltitles__page-info">
            <span className="alltitles__page-current">Página {currentPage}</span>
            {totalPages > 1 && (
              <span className="alltitles__page-total"> de {totalPages}</span>
            )}
          </div>

          <button
            className="alltitles__page-btn"
            onClick={nextPage}
            disabled={!hasNextPage}
          >
            Siguiente →
          </button>
        </nav>
      )}

      {/* Sin resultados */}
      {!isLoading && items.length === 0 && !isError && (
        <p className="alltitles__empty">No hay títulos disponibles.</p>
      )}
    </div>
  );
}

export default AllTitles;
