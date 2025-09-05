import { createContext } from "react";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  coursesOffered: string[];
  attended: number;
  totalClasses: number;
  absent: number;
  profilePic: string;
  isAdmin: boolean;
};

export type State = {
  user: User | null;
  token: string | null;
};

export type Action =
  | { type: "LOGIN"; payload: { user: User | null; token: string } }
  | { type: "LOGOUT" };

export type AuthContextType = State & {
  login: (user: User, token: string) => void;
  logout: () => void;
  dispatch: React.Dispatch<Action>;
  isInitializing: boolean;
};

export const initialState: State = {
  user: null,
  token: null,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: () => {},
  logout: () => {},
  dispatch: () => {},
  isInitializing: true,
});