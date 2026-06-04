/**
 * @fileoverview Página de detalle de título (Details).
 * Ruta: /details/:id
 * Muestra la información completa de una película o serie usando GetDetails.
 *
 * @component
 * @returns {JSX.Element}
 */
import { useParams } from 'react-router-dom';

function Details() {
  const { id } = useParams();

  // TODO: Usar GetDetails con el id
  return (
    <div className="details-page">
      <h1>Detalle del Título {id}</h1>
    </div>
  );
}

export default Details;
