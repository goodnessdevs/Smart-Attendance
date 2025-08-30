import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  matricNo: string;
  onboarded?: boolean;
  profilePic: string;
};

export type State = {
  user: User | null;
  token: string | null;
};

export type Action =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" };

export type AuthContextType = State & {
  login: (user: User, token: string) => void;
  logout: () => void;
  dispatch: React.Dispatch<Action>;
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
});
