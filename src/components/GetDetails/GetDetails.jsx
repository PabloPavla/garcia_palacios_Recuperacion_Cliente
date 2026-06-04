/**
 * @fileoverview Componente GetDetails.
 * Muestra la información extendida de un título: sinopsis, puntuación,
 * servicios de streaming donde está disponible y tráiler si existe.
 * Usa react-query para obtener los datos del título por su ID.
 *
 * @component
 * @param {Object} props
 * @param {number|string} props.id - ID del título en Watchmode
 * @returns {JSX.Element}
 */
import { useQuery } from '@tanstack/react-query';
import { getTitleDetails } from '../../api/watchmode';
import useFavorites from '../../hooks/useFavorites';
import './GetDetails.css';

/**
 * Filtra y agrupa las fuentes de streaming por tipo.
 * Elimina duplicados y organiza por categoría (sub, free, buy, rent).
 *
 * @param {Array} sources - Array de fuentes de streaming de la API
 * @returns {Object} Fuentes agrupadas por tipo
 */
function groupSources(sources) {
  if (!sources || !Array.isArray(sources)) return {};

  const groups = {};
  const seen = new Set();

  sources.forEach((source) => {
    const key = `${source.source_id}-${source.type}`;
    if (!seen.has(key)) {
      seen.add(key);
      const type = source.type || 'other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(source);
    }
  });

  return groups;
}

/**
 * Traduce el tipo de fuente a español.
 *
 * @param {string} type - Tipo de fuente (sub, free, buy, rent)
 * @returns {string} Tipo traducido
 */
function translateSourceType(type) {
  const labels = {
    sub: '📺 Suscripción',
    free: '🆓 Gratis',
    buy: '🛒 Comprar',
    rent: '🎬 Alquilar',
    addon: '➕ Addon',
  };
  return labels[type] || type;
}

function GetDetails({ id }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  /**
   * Query de react-query para obtener los detalles del título.
   * Se activa solo cuando hay un ID válido.
   */
  const { data: title, isLoading, isError, error } = useQuery({
    queryKey: ['titleDetails', id],
    queryFn: () => getTitleDetails(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="details__loading">
        <div className="details__spinner"></div>
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="details__error">
        <p>❌ Error al cargar los detalles</p>
        <p className="details__error-msg">{error?.message}</p>
      </div>
    );
  }

  if (!title) return null;

  const favorite = isFavorite(Number(id));
  const sourcesGrouped = groupSources(title.sources);
  const year = title.year || title.release_date?.split('-')[0] || '';

  return (
    <div className="details">
      {/* Cabecera con póster e info principal */}
      <div className="details__header">
        <div className="details__poster-wrapper">
          {title.poster ? (
            <img
              src={title.poster}
              alt={`Póster de ${title.title}`}
              className="details__poster"
            />
          ) : (
            <div className="details__no-poster">🎬</div>
          )}
        </div>

        <div className="details__main-info">
          <h1 className="details__title">{title.title}</h1>

          <div className="details__meta">
            {year && <span className="details__badge">{year}</span>}
            {title.type && (
              <span className="details__badge details__badge--type">
                {title.type === 'movie' ? 'Película' : 'Serie'}
              </span>
            )}
            {title.runtime_minutes && (
              <span className="details__badge">{title.runtime_minutes} min</span>
            )}
            {title.us_rating && (
              <span className="details__badge">{title.us_rating}</span>
            )}
          </div>

          {/* Puntuación */}
          {title.user_rating && (
            <div className="details__rating">
              <span className="details__rating-star">⭐</span>
              <span className="details__rating-value">{title.user_rating}</span>
              <span className="details__rating-max">/ 10</span>
            </div>
          )}

          {/* Géneros */}
          {title.genre_names && title.genre_names.length > 0 && (
            <div className="details__genres">
              {title.genre_names.map((genre) => (
                <span key={genre} className="details__genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Botón favorito */}
          <button
            className={`details__fav-btn ${favorite ? 'details__fav-btn--active' : ''}`}
            onClick={() => toggleFavorite(Number(id))}
          >
            {favorite ? '❤️ En favoritos' : '🤍 Añadir a favoritos'}
          </button>
        </div>
      </div>

      {/* Sinopsis */}
      {title.plot_overview && (
        <section className="details__section">
          <h2 className="details__section-title">Sinopsis</h2>
          <p className="details__plot">{title.plot_overview}</p>
        </section>
      )}

      {/* Dónde verla - Streaming */}
      {Object.keys(sourcesGrouped).length > 0 && (
        <section className="details__section">
          <h2 className="details__section-title">Dónde verla</h2>
          <div className="details__sources">
            {Object.entries(sourcesGrouped).map(([type, sources]) => (
              <div key={type} className="details__source-group">
                <h3 className="details__source-type">{translateSourceType(type)}</h3>
                <div className="details__source-list">
                  {sources.map((source) => (
                    <a
                      key={`${source.source_id}-${source.type}`}
                      href={source.web_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="details__source-item"
                    >
                      {source.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tráiler */}
      {title.trailer && (
        <section className="details__section">
          <h2 className="details__section-title">Tráiler</h2>
          <div className="details__trailer">
            {title.trailer.includes('youtube') ? (
              <iframe
                src={title.trailer.replace('watch?v=', 'embed/')}
                title={`Tráiler de ${title.title}`}
                className="details__trailer-iframe"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <a
                href={title.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="details__trailer-link"
              >
                🎥 Ver tráiler
              </a>
            )}
          </div>
        </section>
      )}

      {title.trailer_thumbnail && !title.trailer && (
        <section className="details__section">
          <h2 className="details__section-title">Tráiler</h2>
          <img
            src={title.trailer_thumbnail}
            alt="Thumbnail del tráiler"
            className="details__trailer-thumb"
          />
        </section>
      )}
    </div>
  );
}

export default GetDetails;
