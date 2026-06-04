/**
 * @fileoverview Componente GetMediaCard.
 * Muestra una tarjeta con los datos básicos de un título (película/serie).
 * Incluye botón para añadir/quitar de favoritos.
 *
 * @component
 * @param {Object} props
 * @param {number} props.id - ID del título en Watchmode
 * @param {string} props.title - Nombre del título
 * @param {number} props.year - Año de estreno
 * @param {string} props.type - Tipo: 'movie', 'tv_series', etc.
 * @param {string} props.image - URL de la imagen/póster
 * @returns {JSX.Element}
 *
 * @example
 * <GetMediaCard
 *   id={123}
 *   title="Breaking Bad"
 *   year={2008}
 *   type="tv_series"
 *   image="https://cdn.watchmode.com/posters/123.jpg"
 * />
 */
import { Link } from 'react-router-dom';
import useFavorites from '../../hooks/useFavorites';
import './GetMediaCard.css';

/**
 * Traduce el tipo de la API a un texto legible en español.
 *
 * @param {string} type - Tipo crudo de la API (ej: 'tv_series', 'movie')
 * @returns {string} Tipo formateado para mostrar
 */
function formatType(type) {
  const types = {
    movie: 'Película',
    tv_series: 'Serie',
    tv_miniseries: 'Miniserie',
    tv_movie: 'TV Movie',
    short_film: 'Corto',
  };
  return types[type] || type;
}

/**
 * Componente GetMediaCard para mostrar un título.
 *
 * @param {Object} props
 * @param {number} props.id - ID del título en Watchmode
 * @param {string} props.title - Nombre del título
 * @param {number} props.year - Año de estreno
 * @param {string} props.type - Tipo de título
 * @param {string} props.image - URL de la imagen
 * @returns {JSX.Element}
 */
function GetMediaCard({ id, title, year, type, image }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorite = isFavorite(id);

  /**
   * Alterna el estado de favorito del título.
   *
   * @param {React.MouseEvent} e - Evento del click
   */
  const handleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite(id);
  };

  return (
    <article className="media-card">
      <Link to={`/details/${id}`} className="media-card__link-wrapper" aria-label={`Detalles de ${title}`}>
        <div className="media-card__image-wrapper">
          {image ? (
            <img
              src={image}
              alt={`Póster de ${title}`}
              className="media-card__image"
              loading="lazy"
            />
          ) : (
            <div className="media-card__no-image">🎬</div>
          )}
          <span className="media-card__type">{formatType(type)}</span>
        </div>
      </Link>

      <button
        className={`media-card__fav-btn ${favorite ? 'media-card__fav-btn--active' : ''}`}
        onClick={handleFavorite}
        aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        {favorite ? '❤️' : '🤍'}
      </button>

      <div className="media-card__info">
        <h3 className="media-card__title">
          <Link to={`/details/${id}`} className="media-card__title-link">
            {title}
          </Link>
        </h3>
        {year && <span className="media-card__year">{year}</span>}
      </div>
    </article>
  );
}

export default GetMediaCard;
