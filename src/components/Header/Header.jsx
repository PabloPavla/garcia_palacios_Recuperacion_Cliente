/**
 * @fileoverview Componente Header.
 * Cabecera fija de la aplicación con:
 * - Nombre/logo de la app a la izquierda
 * - Enlaces de navegación en el centro
 * - Contador de favoritos a la derecha
 *
 * @component
 * @returns {JSX.Element}
 */
import { NavLink } from 'react-router-dom';
import useFavorites from '../../hooks/useFavorites';
import './Header.css';

/**
 * Componente de cabecera principal.
 * Se muestra en todas las páginas gracias al router.
 * Usa NavLink para resaltar la ruta activa.
 *
 * @returns {JSX.Element} Cabecera con navegación y contador de favoritos
 */
function Header() {
  const { favoritesCount } = useFavorites();

  return (
    <header className="header">
      <div className="header__logo">
        <NavLink to="/" className="header__brand">
          🎬 WatchFlix
        </NavLink>
      </div>

      <nav className="header__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `header__link ${isActive ? 'header__link--active' : ''}`
          }
        >
          Inicio
        </NavLink>
        <NavLink
          to="/myplatforms"
          className={({ isActive }) =>
            `header__link ${isActive ? 'header__link--active' : ''}`
          }
        >
          Mis Plataformas
        </NavLink>
        <NavLink
          to="/all"
          className={({ isActive }) =>
            `header__link ${isActive ? 'header__link--active' : ''}`
          }
        >
          Catálogo
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `header__link ${isActive ? 'header__link--active' : ''}`
          }
        >
          Favoritos
        </NavLink>
      </nav>

      <div className="header__favorites">
        <NavLink to="/favorites" className="header__fav-btn">
          ❤️ <span className="header__fav-count">{favoritesCount}</span>
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
