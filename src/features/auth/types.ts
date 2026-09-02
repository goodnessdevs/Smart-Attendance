export type Role = "student" | "lecturer" | "admin";

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
  level: string;
  matricNumber: string;
  department: string;
  college: string;
  googleId: string;
  phoneNumber: string;
  device_uuid: string;
  fingerprint: string;
};

/** What the BFF reports about the current cookie session. */
export type Session = {
  authenticated: boolean;
  isLecturer: boolean;
  isAdmin: boolean;
  onboarded: boolean;
};

export const ANONYMOUS_SESSION: Session = {
  authenticated: false,
  isLecturer: false,
  isAdmin: false,
  onboarded: false,
};

/** The area of the app a session belongs in, derived from backend flags. */
export function roleForSession(session: Session): Role {
  if (session.isAdmin) return "admin";
  if (session.isLecturer) return "lecturer";
  return "student";
}
