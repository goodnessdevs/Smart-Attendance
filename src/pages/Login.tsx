// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { UserLock } from "lucide-react";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { useEffect } from "react";
// import { useAuthContext } from "../hooks/use-auth";

// const MotionCard = motion.create(Card);

// function Login() {
//   const navigate = useNavigate();
//   const d = new Date();
//   const year = d.getFullYear();
//   const { login } = useAuthContext();

//   // ✅ Listen for messages from popup (Google OAuth)
//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       // Only trust messages from your backend
//       if (event.origin !== import.meta.env.VITE_BACKEND_URL) return;

//       const { token } = event.data as { token?: string };

//       if (token) {
//         localStorage.setItem("jwt_token", token);

//         // Validate token with backend
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             console.log("User data:", data);

//             login({
//               user: data.user,
//               token,
//             });

//             if (data.onboarded) {
//               navigate("/dashboard");
//             } else {
//               navigate("/onboarding");
//             }
//           })
//           .catch((err) => {
//             console.error("Token validation failed:", err);
//             localStorage.removeItem("jwt_token");
//           });
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [navigate]);

//   // ✅ Open popup for Google login
//   const handleGoogleAuth = () => {
//     const width = 500;
//     const height = 600;
//     const left = window.screen.width / 2 - width / 2;
//     const top = window.screen.height / 2 - height / 2;

//     window.open(
//       import.meta.env.VITE_API_AUTH_URL,
//       "Google Login",
//       `width=${width},height=${height},top=${top},left=${left}`
//     );
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-tl from-green-600 to-[#e0ffe7] px-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.9, ease: "easeInOut" }}
//         viewport={{ once: false }}
//         className="flex items-center justify-start gap-x-2 mb-8"
//       >
//         <div className="w-24 h-24">
//           <img
//             src="/funaab.png"
//             alt="funaab"
//             className="object-contain w-full h-full"
//           />
//         </div>
//         <h2 className="text-2xl text-black font-bold">Smart Attendance</h2>
//       </motion.div>

//       <MotionCard
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.9, ease: "easeInOut" }}
//         viewport={{ once: false }}
//         className="w-full max-w-md shadow-xl bg-white text-black"
//       >
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
//           <CardDescription className="text-gray-500">
//             Welcome back, please log in
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <div className="flex justify-center">
//             <UserLock className="h-10 w-10 text-blue-500" />
//           </div>

//           <motion.div
//             initial={{ borderRadius: 8 }}
//             whileHover={{
//               borderRadius: 999,
//               transition: { duration: 1, ease: "easeInOut" },
//             }}
//           >
//             <Button
//               onClick={handleGoogleAuth}
//               className="w-full flex gap-2 cursor-pointer justify-center text-black items-center bg-slate-200 hover:bg-slate-300 transition-colors"
//             >
//               <img
//                 src="https://www.svgrepo.com/show/355037/google.svg"
//                 alt="Google"
//                 className="w-5 h-5"
//               />
//               <>Continue in with Google</>
//             </Button>
//           </motion.div>

//           <div className="text-center text-sm font-semibold">
//             Don’t have an account?{" "}
//             <Link
//               to="/signup"
//               className="text-blue-600 hover:underline hover:text-blue-800"
//             >
//               Sign up
//             </Link>
//           </div>
//         </CardContent>
//       </MotionCard>

//       <p className="text-center text-black mt-4">
//         &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
//         reserved.
//       </p>
//     </div>
//   );
// }

// export default Login;

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserLock, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/use-auth"; // ✅ Hook for AuthContext
import { toast } from "sonner";

const MotionCard = motion.create(Card);

function Login() {
  const navigate = useNavigate();
  const d = new Date();
  const year = d.getFullYear();

  const { login, dispatch } = useAuthContext(); // ✅ From AuthContext
  const [loading, setLoading] = useState(false); // ✅ Loading state for button

  // ✅ Listen for messages from popup (Google OAuth)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_BACKEND_URL) return;

      const { token } = event.data as { token?: string };

      if (token) {
        localStorage.setItem("jwt_token", token);
        setLoading(true);

        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/dashboard`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error("Failed to validate token");
          }

          const data = await res.json();
          console.log("User data:", data);

          // Update global AuthContext
          login(data.user, token); // or dispatch({ type: "LOGIN", payload: data.user })

          // Navigate depending on onboarding status
          if (res.ok) {
            setLoading(false);
            toast.success('Sign in successful');
            navigate("/onboarding");
          } else {
            setLoading(false);
            toast.error('Something went wrong. Please try again');
          }
        } catch (err) {
          console.error("Token validation failed:", err);
          localStorage.removeItem("jwt_token");
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, login, dispatch]);

  // ✅ Open popup for Google login
  const handleGoogleAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    setLoading(true);

    window.open(
      import.meta.env.VITE_API_AUTH_URL,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-tl from-green-600 to-[#e0ffe7] px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        viewport={{ once: false }}
        className="flex items-center justify-start gap-x-2 mb-8"
      >
        <div className="w-24 h-24">
          <img
            src="/funaab.png"
            alt="funaab"
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-2xl text-black font-bold">Smart Attendance</h2>
      </motion.div>

      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        viewport={{ once: false }}
        className="w-full max-w-md shadow-xl bg-white text-black"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-gray-500">
            Welcome back, please log in
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <UserLock className="h-10 w-10 text-blue-500" />
          </div>

          <motion.div
            initial={{ borderRadius: 8 }}
            whileHover={{
              borderRadius: 999,
              transition: { duration: 1, ease: "easeInOut" },
            }}
          >
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex gap-2 cursor-pointer justify-center text-black items-center bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <>Signing in...</>
                </>
              ) : (
                <>
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <>Continue with Google</>
                </>
              )}
            </Button>
          </motion.div>

          <div className="text-center text-sm font-semibold">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </MotionCard>

      <p className="text-center text-black mt-4">
        &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
        reserved.
      </p>
    </div>
  );
}

export default Login;
