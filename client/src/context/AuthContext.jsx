import { createContext, useContext, useState, useEffect } from "react";
import { getApiUrl } from "@/config/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(localStorage.getItem("coparents_token"));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch(getApiUrl("/api/auth/profile"), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem("coparents_token");
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("coparents_token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (phone, password) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      localStorage.setItem("coparents_token", data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto-login if token is present
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("coparents_token", data.token);
        setUser(data.user);
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  const forgetPassword = async (userData) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/forget"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // setToken(data.token);
      // localStorage.setItem("coparents_token", data.token);
      // setUser(data);
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  const otpVerify = async (userData) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/verify-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // If server returned a token (signup flow), store it and set user
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("coparents_token", data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }

      // For reset flow (no token), return reset token and info
      return { success: true, resetToken: data.resetToken, userId: data.userId, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  const resetPassword = async (userData) => {
    try {
      const response = await fetch(getApiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reset failed");
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("coparents_token");
  };

  const value = {
    user,
    token, // Add token here
    loading,
    login,
    register,
    logout,
    otpVerify,
    forgetPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
