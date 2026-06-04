/**
 * @fileoverview Configuración de rutas de la aplicación.
 * Define todas las rutas usando react-router-dom.
 *
 * Rutas:
 * - /              → Home (buscador + trending)
 * - /myplatforms   → Selección de plataformas
 * - /all           → Listado completo paginado
 * - /favorites     → Favoritos del usuario
 * - /details/:id   → Detalle de título
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header';
import Home from '../pages/Home/Home';
import MyPlatforms from '../pages/MyPlatforms/MyPlatforms';
import AllTitles from '../pages/AllTitles/AllTitles';
import Favorites from '../pages/Favorites/Favorites';
import Details from '../pages/Details/Details';

/**
 * Componente que define el enrutado completo de la aplicación.
 *
 * @component
 * @returns {JSX.Element}
 */
function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myplatforms" element={<MyPlatforms />} />
          <Route path="/all" element={<AllTitles />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default AppRouter;
