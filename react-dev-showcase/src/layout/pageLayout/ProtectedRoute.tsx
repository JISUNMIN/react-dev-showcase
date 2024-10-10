import { Navigate, Outlet, matchPath, useLocation } from 'react-router-dom';

import { useAuth } from '@src/hooks';
import { ISDEV } from '@src/libs/Environment';
import { menuPathMap } from '@src/router/router';

const ProtectedRoute = () => {
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated, adminType, accessibleMenuList } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  const isAccessible = accessibleMenuList.some((menu) => {
    const path = menuPathMap[menu.code as keyof typeof menuPathMap];
    return matchPath({ path: `${path}/*`, end: false }, location.pathname);
  });

  if (!ISDEV && !isAccessible) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
