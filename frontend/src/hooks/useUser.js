import { useState, useEffect, useCallback } from "react";
import * as API from "../api/api";

export function useUser() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const saveToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };
  const loadUser = useCallback(async (currentToken) => {
    try {
      setLoading(true);
      const profile = await API.fetchUserProfile(currentToken);
      setUser(profile);
    } catch (err) {
      setUser(null);
      saveToken("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUser(token);
    } else {
      setUser(null);
    }
  }, [token, loadUser]);

  const register = async (name, email, password) => {

    try {
      await API.register(name, email, password);
      await login(name, password);
    } catch (err) {
      throw err;
    }
  };

  const login = async (username, password) => {
    try {
      const data = await API.login(username, password);
      saveToken(data.access_token);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
      saveToken("");
      setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await API.updateUserProfile(token, profileData);

      if (data.access_token) {
        saveToken(data.access_token);
      }
      const updatedProfile = await API.fetchUserProfile(data.access_token);
      if(updateProfile){
        setUser(updatedProfile);
      }
      return updatedProfile;
    } catch (err) {
      throw err;
    }
  };

  const deleteAccount = async () => {
      try {
        await API.deleteUserAccount(token);
        alert("Аккаунт удалён");
        logout();
      } catch (err) {
        throw err;
      }
  };

  return {
    token,
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  };
}
