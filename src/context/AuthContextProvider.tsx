// import { useEffect, useReducer, useState } from "react";
// import type { ReactNode } from "react";
// import { AuthContext, initialState, type Action, type State, type User } from "./AuthContext";
// import { clearDeviceData } from "../utils/indexedDB";

// const authReducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case "LOGIN":
//       return { 
//         user: action.payload.user, 
//         token: action.payload.token 
//       };
//     case "LOGOUT":
//       return { 
//         user: null, 
//         token: null 
//       };
//     default:
//       return state;
//   }
// };

// export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//   const [isInitializing, setIsInitializing] = useState(true);

//   useEffect(() => {
//     let isCancelled = false;

//     const initializeAuth = async () => {
//       const token = localStorage.getItem("jwt_token");

//       if (!token) {
//         setIsInitializing(false);
//         return;
//       }

//       try {
//         // Check onboarding status via /dashboard
//         const dashboardResponse = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/dashboard`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!dashboardResponse.ok) {
//           throw new Error("Invalid token");
//         }

//         const dashboardData = await dashboardResponse.json();
        
//         // If user is onboarded, fetch full user details
//         if (dashboardData.onboarded) {
//           const userResponse = await fetch(
//             `${import.meta.env.VITE_BACKEND_URL}/user-details`,
//             {
//               method: "GET",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           if (!userResponse.ok) {
//             throw new Error("Failed to fetch user details");
//           }

//           const userData = await userResponse.json();

//           if (!isCancelled) {
//             dispatch({ 
//               type: "LOGIN", 
//               payload: { 
//                 user: userData,
//                 token 
//               } 
//             });
//           }
//         } else if (dashboardData.user && !isCancelled) {
//           // User exists but not onboarded yet - store partial data
//           dispatch({ 
//             type: "LOGIN", 
//             payload: { 
//               user: dashboardData.user, 
//               token 
//             } 
//           });
//         }

//       } catch (error) {
//         console.error("Failed to initialize auth:", error);
        
//         if (!isCancelled) {
//           localStorage.removeItem("jwt_token");
//           await clearDeviceData();
//           dispatch({ type: "LOGOUT" });
//         }
//       } finally {
//         if (!isCancelled) {
//           setIsInitializing(false);
//         }
//       }
//     };

//     initializeAuth();

//     return () => {
//       isCancelled = true;
//     };
//   }, []);

//   const login = (user: User, token: string) => {
//     localStorage.setItem("jwt_token", token);
//     dispatch({ type: "LOGIN", payload: { user, token } });
//   };

//   const logout = async () => {
//     try {
//       await clearDeviceData();
//       console.log("Device data cleared from IndexedDB");
//     } catch (error) {
//       console.error("Failed to clear device data:", error);
//     } finally {
//       localStorage.removeItem("jwt_token");
//       dispatch({ type: "LOGOUT" });
//     }
//   };

//   const contextValue = {
//     ...state,
//     login,
//     logout,
//     dispatch,
//     isInitializing,
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { useEffect, useReducer, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, initialState, type Action, type State, type User } from "./AuthContext";
import { clearDeviceData } from "../utils/indexedDB";

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token
      };
    case "LOGOUT":
      return {
        user: null,
        token: null
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessingToken, setIsProcessingToken] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const initializeAuth = async () => {
      // Don't initialize if we're currently processing a new token
      if (isProcessingToken) {
        setIsInitializing(false);
        return;
      }

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
        
        console.log("AuthContextProvider - Dashboard response:", dashboardData);
        console.log("AuthContextProvider - Onboarded status:", dashboardData.onboarded, typeof dashboardData.onboarded);
                
        // If user is onboarded, fetch full user details
        if (dashboardData.onboarded === true) {
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
                user: userData,
                token
              }
            });
          }
        } else if (dashboardData.user && !isCancelled) {
          // User exists but not onboarded yet - store partial data
          dispatch({
            type: "LOGIN",
            payload: {
              user: dashboardData.user,
              token
            }
          });
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
  }, [isProcessingToken]);

  const login = (user: User, token: string) => {
    localStorage.setItem("jwt_token", token);
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = async () => {
    try {
      await clearDeviceData();
      console.log("Device data cleared from IndexedDB");
    } catch (error) {
      console.error("Failed to clear device data:", error);
    } finally {
      localStorage.removeItem("jwt_token");
      dispatch({ type: "LOGOUT" });
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
      {children}
    </AuthContext.Provider>
  );
};