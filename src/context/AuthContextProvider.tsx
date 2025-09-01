// import { useEffect, useReducer } from "react";
// import type { ReactNode } from "react";
// import { AuthContext, initialState } from "./AuthContext";
// import type { User, State } from "./AuthContext";

// type Action =
//   | { type: "LOGIN"; payload: { user: User; token: string } }
//   | { type: "LOGOUT" };

// const authReducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case "LOGIN":
//       return { user: action.payload.user, token: action.payload.token };
//     case "LOGOUT":
//       return { user: null, token: null };
//     default:
//       return state;
//   }
// };

// export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   useEffect(() => {
//     const token = localStorage.getItem("jwt_token");

//     if (token) {
//       fetch(`${import.meta.env.VITE_BACKEND_URL}/user-details`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Invalid token");
//           return res.json();
//         })
//         .then((data) => {
//           dispatch({ type: "LOGIN", payload: { user: data, token } });
//         })
//         .catch(() => {
//           localStorage.removeItem("jwt_token");
//           dispatch({ type: "LOGOUT" });
//         });
//     }
//   }, []);

//   const login = (user: User, token: string) => {
//     localStorage.setItem("jwt_token", token);
//     dispatch({ type: "LOGIN", payload: { user, token } });
//   };

//   const logout = async () => {
//     localStorage.removeItem("jwt_token");
//     dispatch({ type: "LOGOUT" });
//   };

//   return (
//     <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { AuthContext, initialState } from "./AuthContext";
import type { User, State } from "./AuthContext";
import { clearDeviceData } from "../utils/indexedDB";
import { getDeviceInfo } from "../utils/deviceUtils";

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
      // Get user details when app loads with existing token
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-details`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error("Invalid token");
          
          const userData = await response.json();
          
          // Get device info and add to user object
          const deviceInfo = await getDeviceInfo();
          const user: User = {
            ...userData,
            device_uuid: deviceInfo.device_uuid,
            fingerprint: deviceInfo.fingerprint,
          };

          dispatch({ type: "LOGIN", payload: { user, token } });
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          localStorage.removeItem("jwt_token");
          await clearDeviceData(); // Clear device data if token is invalid
          dispatch({ type: "LOGOUT" });
        }
      };

      fetchUserDetails();
    }
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
      // Continue with logout even if clearing fails
    }
    
    localStorage.removeItem("jwt_token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};