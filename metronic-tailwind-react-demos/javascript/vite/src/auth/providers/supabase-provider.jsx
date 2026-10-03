import { useEffect, useState } from 'react';
import { AuthAdapter } from '@/auth/adapters';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';

// Define the Supabase Auth Provider
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(currentUser?.is_admin === true);
  }, [currentUser]);

  const verify = async () => {
    if (auth) {
      try {
        const user = await getUser();
        setCurrentUser(user || undefined);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email, password) => {
    try {
      const auth = await AuthAdapter.login(email, password);
      saveAuth(auth);
      const user = await getUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const register = async (
    email,
    password,
    password_confirmation,
    firstName,
    lastName,
  ) => {
    try {
      const auth = await AuthAdapter.register(
        email,
        password,
        password_confirmation,
        firstName,
        lastName,
      );
      saveAuth(auth);
      const user = await getUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    await AuthAdapter.requestPasswordReset(email);
  };

  const resetPassword = async (password, password_confirmation) => {
    await AuthAdapter.resetPassword(password, password_confirmation);
  };

  const resendVerificationEmail = async (email) => {
    await AuthAdapter.resendVerificationEmail(email);
  };

  const getUser = async () => {
    return await AuthAdapter.getCurrentUser();
  };

  const updateProfile = async (userData) => {
    return await AuthAdapter.updateUserProfile(userData);
  };

  const logout = () => {
    AuthAdapter.logout();
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        resendVerificationEmail,
        getUser,
        updateProfile,
        logout,
        verify,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
