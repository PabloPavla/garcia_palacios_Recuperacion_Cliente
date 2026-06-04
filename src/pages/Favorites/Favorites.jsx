/**
 * @fileoverview Página de favoritos (Favorites).
 * Ruta: /favorites
 * Muestra los títulos que el usuario ha guardado como favoritos.
 * Obtiene los detalles de cada favorito mediante react-query.
 *
 * @component
 * @returns {JSX.Element}
 */
import { useQueries } from '@tanstack/react-query';
import { getTitleById } from '../../api/watchmode';
import useFavorites from '../../hooks/useFavorites';
import GetMediaCard from '../../components/GetMediaCard/GetMediaCard';
import './Favorites.css';

/**
 * Componente de página Favorites.
 * Lista todos los títulos que han sido guardados como favoritos en localStorage
 * y realiza consultas en paralelo usando react-query para obtener sus detalles.
 *
 * @component
 * @returns {JSX.Element} Vista del listado de favoritos
 */
function Favorites() {
  const { favorites, favoritesCount } = useFavorites();

  /**
   * Lanza una query por cada ID de favorito para obtener sus detalles.
   * useQueries permite hacer múltiples queries en paralelo.
   */
  const queries = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ['titleDetails', id],
      queryFn: () => getTitleById(id),
      enabled: !!id,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const loadedTitles = queries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => q.data);

  return (
    <div className="favorites-page">
      <h1 className="favorites__title">Mis Favoritos</h1>
      <p className="favorites__subtitle">
        {favoritesCount > 0
          ? `Tienes ${favoritesCount} título${favoritesCount !== 1 ? 's' : ''} guardado${favoritesCount !== 1 ? 's' : ''}`
          : 'Aún no has añadido ningún título a favoritos'}
      </p>

      {/* Estado vacío */}
      {favoritesCount === 0 && (
        <div className="favorites__empty">
          <span className="favorites__empty-icon">🤍</span>
          <p>Explora el catálogo y guarda los títulos que más te gusten</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && favoritesCount > 0 && (
        <div className="favorites__loading">
          <div className="favorites__spinner"></div>
          <p>Cargando tus favoritos...</p>
        </div>
      )}

      {/* Grid de favoritos */}
      {loadedTitles.length > 0 && (
        <div className="favorites__grid">
          {loadedTitles.map((item) => (
            <GetMediaCard
              key={item.id}
              id={item.id}
              title={item.title}
              year={item.year || item.release_date?.split('-')[0]}
              type={item.type}
              image={item.poster}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
