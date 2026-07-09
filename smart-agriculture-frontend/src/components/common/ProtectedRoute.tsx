import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Layout } from '../layout/Layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps any route that requires authentication.
 * - Checks for a valid accessToken in the auth store.
 * - Unauthenticated users are redirected to /signin,
 *   with the original destination saved so they can be
 *   sent there after a successful login.
 * - Authenticated users get the full Layout (Navbar + Sidebar).
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  // Treat as unauthenticated if there is no valid token
  if (!isAuthenticated || !token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
