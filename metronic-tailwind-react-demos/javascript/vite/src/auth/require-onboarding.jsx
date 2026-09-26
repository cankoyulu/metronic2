import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/auth-context';
import { isOnboardingComplete } from '@/lib/onboarding-db';

/**
 * Portala erişimden önce ön kayıt tamamlanmış mı denetler.
 * Tamamlanmadıysa adayı /onboarding sihirbazına yönlendirir.
 */
export const RequireOnboarding = () => {
  const { user } = useAuth();
  const userId = user?.id;

  // Kullanıcı bilgisi henüz gelmediyse engelleme; tekrar denenecek.
  if (userId && !isOnboardingComplete(userId)) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
