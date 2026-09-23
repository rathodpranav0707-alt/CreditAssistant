/**
 * AuthContext.jsx — Authentication state management.
 *
 * Persists the logged-in user (id, name, email, mobile) to localStorage
 * so the session survives a page refresh.
 *
 * login() and register() now call the real FastAPI backend.
 * The user object stored in state always includes `user_id` so that
 * other parts of the app can make authenticated API calls.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/api';

const AuthContext = createContext();

const STORAGE_KEY = 'credit_assistant_user';

export const AuthProvider = ({ children }) => {
  // Restore session from localStorage on first load
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep localStorage in sync whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  /**
   * Register a new user via the backend API.
   * Returns { success: true, userId } on success
   * Returns { success: false, error: "..." } on failure
   */
  const register = async (userData) => {
    const result = await registerUser(userData);

    if (result.ok) {
      const loggedUser = {
        user_id: result.data.user_id,
        name: result.data.name,
        email: result.data.email,
        mobile: result.data.mobile,
        isLoggedIn: true,
      };
      setUser(loggedUser);
      return { success: true, userId: result.data.user_id };
    }

    return { success: false, error: result.error };
  };

  /**
   * Log in an existing user via the backend API.
   * Returns { success: true, userId } on success
   * Returns { success: false, error: "..." } on failure
   */
  const login = async (email, password) => {
    const result = await loginUser({ email, password });

    if (result.ok) {
      const loggedUser = {
        user_id: result.data.user_id,
        name: result.data.name,
        email: result.data.email,
        mobile: result.data.mobile,
        isLoggedIn: true,
      };
      setUser(loggedUser);
      return { success: true, userId: result.data.user_id };
    }

    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('credit_assistant_financial_data');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user?.isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
