/**
 * @fileoverview Página de selección de plataformas (MyPlatforms).
 * Ruta: /myplatforms
 * Permite al usuario seleccionar las plataformas de streaming a las que está suscrito.
 * Usa react-query para obtener la lista de plataformas de la API
 * y el PlatformContext para guardar la selección del usuario.
 *
 * @component
 * @returns {JSX.Element}
 */
import { useQuery } from '@tanstack/react-query';
import { getSources } from '../../api/watchmode';
import { usePlatforms } from '../../context/PlatformContext';
import './MyPlatforms.css';

/**
 * Componente de página MyPlatforms.
 * Muestra la lista de plataformas disponibles en España y permite al usuario
 * seleccionar o deseleccionar plataformas sincronizándolas con el Contexto y localStorage.
 *
 * @component
 * @returns {JSX.Element} Vista de selección de plataformas
 */
function MyPlatforms() {
  const { platforms, setPlatforms } = usePlatforms();

  /**
   * Query para obtener la lista de plataformas disponibles.
   */
  const { data: sources, isLoading, isError, error } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources('ES'),
  });

  /**
   * Alterna la selección de una plataforma.
   * Si está seleccionada la quita, si no la añade.
   *
   * @param {Object} source - Objeto de la plataforma
   */
  const togglePlatform = (source) => {
    setPlatforms((prev) => {
      const exists = prev.find((p) => p.id === source.id);
      if (exists) {
        return prev.filter((p) => p.id !== source.id);
      }
      return [...prev, { id: source.id, name: source.name, logo: source.logo_100px }];
    });
  };

  /**
   * Comprueba si una plataforma está seleccionada.
   *
   * @param {number} id - ID de la plataforma
   * @returns {boolean}
   */
  const isSelected = (id) => platforms.some((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="platforms-page">
        <h1 className="platforms__title">Mis Plataformas</h1>
        <div className="platforms__loading">
          <div className="platforms__spinner"></div>
          <p>Cargando plataformas...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="platforms-page">
        <h1 className="platforms__title">Mis Plataformas</h1>
        <p className="platforms__error">❌ Error al cargar plataformas: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="platforms-page">
      <h1 className="platforms__title">Mis Plataformas</h1>
      <p className="platforms__subtitle">
        Selecciona las plataformas de streaming a las que estás suscrito.
        Esto te ayudará a saber dónde puedes ver cada título.
      </p>

      {/* Plataformas seleccionadas */}
      {platforms.length > 0 && (
        <div className="platforms__selected">
          <h2 className="platforms__section-title">
            ✅ Seleccionadas ({platforms.length})
          </h2>
          <div className="platforms__selected-list">
            {platforms.map((p) => (
              <span key={p.id} className="platforms__selected-tag">
                {p.name}
                <button
                  className="platforms__remove-btn"
                  onClick={() => togglePlatform(p)}
                  aria-label={`Quitar ${p.name}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grid de plataformas disponibles */}
      <div className="platforms__grid">
        {sources && sources.map((source) => (
          <button
            key={source.id}
            className={`platforms__card ${isSelected(source.id) ? 'platforms__card--selected' : ''}`}
            onClick={() => togglePlatform(source)}
          >
            {source.logo_100px && (
              <img
                src={source.logo_100px}
                alt={source.name}
                className="platforms__logo"
                loading="lazy"
              />
            )}
            <span className="platforms__name">{source.name}</span>
            {isSelected(source.id) && (
              <span className="platforms__check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyPlatforms;
