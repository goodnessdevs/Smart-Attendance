import { useEffect, useReducer, useState } from "react";
import type { ReactNode } from "react";
import {
  AuthContext,
  initialState,
  type Action,
  type State,
  type User,
} from "./AuthContext";
import { Loader2 } from "lucide-react";
import { getOrCreateFingerprint } from "../utils/indexedDB";
import { getOrCreateUUID } from "../utils/browserfingerprint";

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
      };
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
        // Check onboarding status via /dashboard
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

        // If user is onboarded, fetch full user details
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
            dispatch({
              type: "LOGIN",
              payload: {
                user: userData.user,
                token,
              },
            });
          }
        } else if (!dashboardData.onboarded && !isCancelled) {
          dispatch({
            type: "LOGIN",
            payload: {
              user: null,
              token,
            },
          });
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);

        if (!isCancelled) {
          localStorage.removeItem("jwt_token");
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

  const login = async (user: User | null, token: string) => {
    localStorage.setItem("jwt_token", token);
    await getOrCreateUUID();
    await getOrCreateFingerprint();
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = async () => {
  try {
    // ❌ don’t clear device DB
    // await clearDeviceData(); 

    localStorage.removeItem("jwt_token");
    dispatch({ type: "LOGOUT" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  const contextValue = {
    ...state,
    login,
    logout,
    dispatch,
    isInitializing,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isInitializing ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-green-700 dark:text-white" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
