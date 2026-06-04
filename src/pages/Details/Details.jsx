/**
 * @fileoverview Página de detalle de título (Details).
 * Ruta: /details/:id
 * Extrae el ID de la URL con useParams y renderiza el componente GetDetails.
 * Incluye un botón para volver atrás.
 *
 * @component
 * @returns {JSX.Element}
 */
import { useParams, useNavigate } from 'react-router-dom';
import GetDetails from '../../components/GetDetails/GetDetails';
import './Details.css';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * Navega a la página anterior del historial.
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="details-page">
      <button className="details-page__back-btn" onClick={handleGoBack}>
        ← Volver
      </button>
      <GetDetails id={id} />
    </div>
  );
}

export default Details;
