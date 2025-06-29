import { Provider } from 'react-redux';
import { store } from './store';
import { GameLayout } from './layouts/GameLayout';
import LoaderScreen from './screens/LoaderScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModuleMapScreen } from './screens/ModuleMap';
import { LevelList } from './screens/LevelList';
import { LevelScene } from './screens/LevelScene';
import AuthPage from './screens/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';
import Level2 from './screens/Level2/Index';
import Level3 from './screens/Level3/Index';
import Level4 from './screens/Level4/Index';
import InstructionsPage from './screens/InstructionsPage';
import { GameBoard2D } from './components/Level4/GameBoard2D';
import BingoGame from './screens/BingoGame';
// Route Error Component
function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorFallback
        error={new Error(`${error.status} ${error.statusText}`)}
        resetErrorBoundary={() => window.location.href = '/'}
        title={`${error.status} - ${error.statusText}`}
        message={error.data?.message || "The page you're looking for doesn't exist or encountered an error."}
      />
    );
  }

  return (
    <ErrorFallback
      error={error instanceof Error ? error : new Error('Unknown route error')}
      resetErrorBoundary={() => window.location.href = '/'}
      title="Navigation Error"
      message="Something went wrong while navigating. Let's get you back on track."
    />
  );
}

const router = createBrowserRouter(
  [
    {
      element: <GameLayout><Outlet /></GameLayout>,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          path: '/',
          element: <AuthPage />,
          errorElement: <RouteErrorBoundary />
        },
        {
          path: '/home',
          element: <HomeScreen />,
          errorElement: <RouteErrorBoundary />
        },
        {
          path: '/modules',
          element: <ModuleMapScreen />,
          errorElement: <RouteErrorBoundary />
        },
        {
          path: '/modules/:moduleId',
          element: <LevelList />,
          errorElement: <RouteErrorBoundary />
        },
        {
          path: '/modules/:moduleId/levels/2',
          element: <Level2 />,
          errorElement: <RouteErrorBoundary />
        },
       
        {
          path: '/modules/:moduleId/levels/3',
          element: <Level3 />,
          errorElement: <RouteErrorBoundary />
        },
        { path: '/modules/:moduleId/levels/1',
          element: <BingoGame />, 
          errorElement: <RouteErrorBoundary /> 
        },
        {
          path: '/modules/:moduleId/levels/4',
          element: <Level4 />,
          errorElement: <RouteErrorBoundary />
        },
        {
          path: '/modules/:moduleId/levels/:levelId',
          element: <LevelScene />,
          errorElement: <RouteErrorBoundary />
        },
        { path: '/auth', element: <AuthPage />,
          errorElement: <RouteErrorBoundary /> },
        { path: '/instructions', element: <InstructionsPage />,
          errorElement: <RouteErrorBoundary /> },
        {
          path: '/modules/:moduleId/levels/4/gameboard2d',
          element: <GameBoard2D />,
          errorElement: <RouteErrorBoundary />
        },
        { path: '*', element: <Navigate to="/" replace />,
          errorElement: <RouteErrorBoundary /> },
      ],
    },
  ]
);

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
}

export default App;