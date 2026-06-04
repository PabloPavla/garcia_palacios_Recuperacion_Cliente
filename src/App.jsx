/**
 * @fileoverview Componente raíz de la aplicación.
 * Envuelve toda la app con los providers necesarios:
 * - QueryClientProvider (react-query) para gestión de peticiones
 * - PlatformProvider (context) para plataformas del usuario
 *
 * @component
 * @returns {JSX.Element}
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlatformProvider } from './context/PlatformContext';
import { FavoritesProvider } from './hooks/useFavorites';
import AppRouter from './router/AppRouter';
import './App.css';

/**
 * Instancia del QueryClient con configuración por defecto.
 * - staleTime: 5 minutos (evita re-fetches innecesarios)
 * - retry: 1 intento adicional en caso de error
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlatformProvider>
        <FavoritesProvider>
          <AppRouter />
        </FavoritesProvider>
      </PlatformProvider>
    </QueryClientProvider>
  );
}

export default App;
