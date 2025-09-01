import { useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { AuthContext, initialState } from "./AuthContext";
import type { User, State } from "./AuthContext";
import { clearDeviceDB } from "../utils/indexedDB";

type Action =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" };

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

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/user-details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => {
          dispatch({ type: "LOGIN", payload: { user: data, token } });
        })
        .catch(() => {
          localStorage.removeItem("jwt_token");
          dispatch({ type: "LOGOUT" });
        });
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("jwt_token", token);
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = async () => {
    localStorage.removeItem("jwt_token");
    dispatch({ type: "LOGOUT" });

    // clear device UUID + fingerprint from IndexedDB
    try {
      await clearDeviceDB();
      console.log("DeviceDB cleared successfully");
    } catch (err) {
      console.error("Failed to clear DeviceDB:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
