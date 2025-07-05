import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('signoffpro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      const userData = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user',
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          twoFactor: false,
          theme: 'light'
        },
        organization: {
          id: 'org_1',
          name: 'Default Organization',
          brandColors: {
            primary: '#4F46E5',
            secondary: '#FBBF24',
            accent: '#10B981'
          },
          logo: null
        }
      };

      setUser(userData);
      localStorage.setItem('signoffpro_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          twoFactor: false,
          theme: 'light'
        },
        organization: {
          id: `org_${Date.now()}`,
          name: `${name}'s Organization`,
          brandColors: {
            primary: '#4F46E5',
            secondary: '#FBBF24',
            accent: '#10B981'
          },
          logo: null
        }
      };

      setUser(userData);
      localStorage.setItem('signoffpro_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('signoffpro_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('signoffpro_user', JSON.stringify(updatedUser));
  };

  const updateOrganization = (orgUpdates) => {
    const updatedUser = {
      ...user,
      organization: { ...user.organization, ...orgUpdates }
    };
    setUser(updatedUser);
    localStorage.setItem('signoffpro_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    updateOrganization,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};