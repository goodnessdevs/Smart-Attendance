import { useEffect, useReducer, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, initialState } from "./AuthContext";
import type { User, State } from "./AuthContext";
import { clearDeviceData } from "../utils/indexedDB";

type Action =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload.user, token: action.payload.token };
    case "LOGOUT":
      return { user: null, token: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const initializeAuth = async () => {
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        // ✅ First check onboarding status via /dashboard
        const dashboardResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!dashboardResponse.ok) {
          throw new Error("Invalid token");
        }

        const dashboardData = await dashboardResponse.json();
        
        // ✅ If user is onboarded, fetch full user details
        if (dashboardData.onboarded) {
          const userResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/user-details`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user details");
          }

          const userData = await userResponse.json();

          if (!isCancelled) {
            // ✅ userData should match your User type exactly
            dispatch({ 
              type: "LOGIN", 
              payload: { 
                user: userData, // Assuming userData IS the User object
                token 
              } 
            });
          }
        } else {
          // ✅ User exists but not onboarded yet
          // You can either:
          // Option 1: Store partial user data if available from dashboard
          if (dashboardData.user && !isCancelled) {
            dispatch({ 
              type: "LOGIN", 
              payload: { 
                user: dashboardData.user, 
                token 
              } 
            });
          }
          // Option 2: Or just keep them logged out until onboarding complete
          // (Current implementation will just not set user in context)
        }

      } catch (error) {
        console.error("Failed to initialize auth:", error);
        
        if (!isCancelled) {
          localStorage.removeItem("jwt_token");
          await clearDeviceData();
          dispatch({ type: "LOGOUT" });
        }
      } finally {
        if (!isCancelled) {
          setIsInitializing(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isCancelled = true;
    };
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("jwt_token", token);
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = async () => {
    try {
      // Clear device data from IndexedDB
      await clearDeviceData();
      console.log("Device data cleared from IndexedDB");
    } catch (error) {
      console.error("Failed to clear device data:", error);
    } finally {
      localStorage.removeItem("jwt_token");
      dispatch({ type: "LOGOUT" });
    }
  };

  // ✅ Enhanced context value with loading state
  const contextValue = {
    ...state,
    login,
    logout,
    dispatch,
    isInitializing,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};