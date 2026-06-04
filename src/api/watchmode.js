/**
 * @fileoverview Funciones de acceso a la API de Watchmode.
 * Centraliza todas las peticiones HTTP a la API.
 * Todas las funciones son asíncronas y devuelven los datos parseados de JSON.
 * Están diseñadas para ser usadas con react-query como queryFn.
 *
 * @see https://api.watchmode.com/docs/
 */

const API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const BASE_URL = 'https://api.watchmode.com/v1';

/**
 * Realiza una petición fetch genérica a la API de Watchmode.
 * Gestiona errores HTTP lanzando excepciones descriptivas.
 *
 * @param {string} endpoint - Endpoint relativo (ej: '/list-titles/')
 * @param {Object} [params={}] - Parámetros de query string
 * @returns {Promise<Object>} Datos de la respuesta parseados como JSON
 * @throws {Error} Si la respuesta HTTP no es ok
 */
async function fetchFromApi(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('apiKey', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.statusMessage || `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Obtiene la lista de títulos disponibles (películas y series).
 * Soporta paginación mediante el parámetro page.
 *
 * @param {Object} [params={}] - Parámetros de filtrado
 * @param {number} [params.page=1] - Número de página
 * @param {string} [params.types] - Filtro por tipo: 'movie', 'tv_series', 'tv_miniseries', etc.
 * @param {string} [params.source_ids] - IDs de plataformas separados por comas
 * @param {string} [params.regions] - Regiones (ej: 'US', 'ES')
 * @returns {Promise<Object>} Objeto con titles (array) y totalResults
 */
export async function getListTitles(params = {}) {
  return fetchFromApi('/list-titles/', params);
}

/**
 * Busca títulos por nombre.
 *
 * @param {string} query - Texto de búsqueda
 * @param {string} [searchType=''] - Tipo de búsqueda: 1 (movie), 2 (tv), 3 (movie & tv)
 * @returns {Promise<Object>} Objeto con results (array de coincidencias)
 */
export async function searchTitles(query, searchType = '') {
  return fetchFromApi('/autocomplete-search/', {
    search_value: query,
    search_type: searchType || undefined,
  });
}

/**
 * Obtiene los detalles completos de un título específico.
 * Incluye sinopsis, puntuación, géneros, etc.
 *
 * @param {number|string} id - ID del título en Watchmode
 * @returns {Promise<Object>} Objeto con toda la información del título
 */
export async function getTitleDetails(id) {
  return fetchFromApi(`/title/${id}/details/`, {
    append_to_response: 'sources',
  });
}

/**
 * Obtiene las fuentes de streaming donde está disponible un título.
 *
 * @param {number|string} id - ID del título en Watchmode
 * @returns {Promise<Array>} Array de fuentes de streaming
 */
export async function getTitleSources(id) {
  return fetchFromApi(`/title/${id}/sources/`);
}

/**
 * Obtiene la lista de plataformas/fuentes de streaming disponibles.
 * Útil para la página de selección de plataformas del usuario.
 *
 * @param {string} [regions='ES'] - Regiones a filtrar
 * @returns {Promise<Array>} Array de plataformas disponibles
 */
export async function getSources(regions = 'ES') {
  return fetchFromApi('/sources/', { regions });
}

/**
 * Obtiene los títulos en tendencia / populares.
 *
 * @param {string} [listType=''] - Tipo de lista 
 * @returns {Promise<Object>} Objeto con los títulos populares
 */
export async function getTrendingTitles(listType = '') {
  return fetchFromApi('/list-titles/', {
    sort_by: 'popularity_desc',
    types: 'movie,tv_series',
  });
}

/**
 * Obtiene los detalles de múltiples títulos a partir de sus IDs.
 * Útil para la página de favoritos donde tenemos IDs guardados en localStorage.
 *
 * @param {number|string} id - ID del título
 * @returns {Promise<Object>} Detalles del título
 */
export async function getTitleById(id) {
  return fetchFromApi(`/title/${id}/details/`, {
    append_to_response: 'sources',
  });
}
