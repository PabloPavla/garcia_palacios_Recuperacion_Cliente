/**
 * @fileoverview Página principal (Home).
 * Ruta: /
 * Contiene un buscador de títulos y la lista de títulos populares/trending.
 * Usa react-query para las peticiones y GetMediaCard para mostrar resultados.
 *
 * @component
 * @returns {JSX.Element}
 */
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { searchTitles, getTrendingTitles } from '../../api/watchmode';
import GetMediaCard from '../../components/GetMediaCard/GetMediaCard';
import './Home.css';

/**
 * Componente de página Home.
 * Renderiza el buscador de títulos y la lista de títulos populares en tendencia.
 *
 * @component
 * @returns {JSX.Element} Vista principal de la aplicación
 */
function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(searchTerm);

  /**
   * Sincroniza el valor del input de búsqueda con el parámetro de la URL.
   * Esto es útil cuando el usuario navega hacia atrás en el historial.
   */
  useEffect(() => {
    setSearchQuery(searchTerm);
  }, [searchTerm]);

  /**
   * Query para títulos trending/populares.
   * Se ejecuta siempre al cargar la página.
   */
  const {
    data: trendingData,
    isLoading: trendingLoading,
    isError: trendingError,
  } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrendingTitles(),
  });

  /**
   * Query para búsqueda de títulos.
   * Solo se ejecuta cuando hay un término de búsqueda.
   */
  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
  } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchTitles(searchTerm),
    enabled: searchTerm.length > 0,
  });

  /**
   * Maneja el envío del formulario de búsqueda.
   * Actualiza el parámetro 'q' de la URL para disparar la query.
   *
   * @param {React.FormEvent} e - Evento del formulario
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  /**
   * Limpia la búsqueda de la URL y restablece el input.
   */
  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const searchResults = searchData?.results || [];
  const trendingTitles = trendingData?.titles || [];
  const isSearching = searchTerm.length > 0;

  return (
    <div className="home-page">
      {/* Hero / Buscador */}
      <section className="home__hero">
        <h1 className="home__title">
          Descubre películas y series
        </h1>
        <p className="home__subtitle">
          Busca entre miles de títulos y encuentra dónde verlos en streaming
        </p>

        <form className="home__search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="home__search-input"
            placeholder="Buscar película o serie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="home__search-btn">
            🔍 Buscar
          </button>
          {isSearching && (
            <button
              type="button"
              className="home__clear-btn"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </form>
      </section>

      {/* Resultados de búsqueda */}
      {isSearching && (
        <section className="home__section">
          <h2 className="home__section-title">
            Resultados para "{searchTerm}"
          </h2>

          {searchLoading && (
            <div className="home__loading">
              <div className="home__spinner"></div>
              <p>Buscando...</p>
            </div>
          )}

          {searchError && (
            <p className="home__error">❌ Error al buscar. Inténtalo de nuevo.</p>
          )}

          {!searchLoading && searchResults.length === 0 && (
            <p className="home__empty">No se encontraron resultados para "{searchTerm}"</p>
          )}

          <div className="home__grid">
            {searchResults.map((item) => (
              <GetMediaCard
                key={item.id}
                id={item.id}
                title={item.name || item.title}
                year={item.year}
                type={item.type}
                image={item.image_url}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending / Populares */}
      {!isSearching && (
        <section className="home__section">
          <h2 className="home__section-title">🔥 Populares</h2>

          {trendingLoading && (
            <div className="home__loading">
              <div className="home__spinner"></div>
              <p>Cargando títulos populares...</p>
            </div>
          )}

          {trendingError && (
            <p className="home__error">❌ Error al cargar títulos populares.</p>
          )}

          <div className="home__grid">
            {trendingTitles.map((item) => (
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
        </section>
      )}
    </div>
  );
}

export default Home;
