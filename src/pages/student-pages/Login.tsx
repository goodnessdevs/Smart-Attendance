// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { UserLock, Loader2 } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { useEffect, useState } from "react";
// import { useAuthContext } from "../../hooks/use-auth";
// import { toast } from "sonner";

// const MotionCard = motion.create(Card);

// function Login() {
//   const navigate = useNavigate();
//   const d = new Date();
//   const year = d.getFullYear();

//   const { login } = useAuthContext();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const handleMessage = async (event: MessageEvent) => {
//       // Accept messages from your backend domain
//       if (event.origin !== import.meta.env.VITE_BACKEND_URL) return;

//       const { token } = event.data as { token?: string };

//       // Handle authentication success
//       if (token) {
//         localStorage.setItem("jwt_token", token);
//         setLoading(true);

//         try {
//           // Check dashboard for onboarding status
//           const dashboardResponse = await fetch(
//             `${import.meta.env.VITE_BACKEND_URL}/dashboard`,
//             {
//               method: "GET",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           if (!dashboardResponse.ok) {
//             throw new Error("Invalid token");
//           }

//           const dashboardData = await dashboardResponse.json();
          
//           // If user is onboarded, fetch full details and go to dashboard
//           if (dashboardData.onboarded) {
//             const userResponse = await fetch(
//               `${import.meta.env.VITE_BACKEND_URL}/user-details`,
//               {
//                 method: "GET",
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );

//             if (!userResponse.ok) {
//               throw new Error("Failed to fetch user details");
//             }

//             const userData = await userResponse.json();
            
//             // Use context login method (it handles localStorage)
//             login(userData, token);
//             toast.success("Welcome back!");
//             navigate("/");
            
//           } else {
//             // User not onboarded - go to onboarding
//             localStorage.setItem("jwt_token", token);
//             toast.success("Please complete your setup");
//             navigate("/onboarding");
//           }

//         } catch (error) {
//           console.error("Authentication failed:", error);
//           toast.error("Authentication failed. Please try again.");
//           localStorage.removeItem("jwt_token");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [navigate, login]);

//   const handleGoogleAuth = () => {
//     const width = 500;
//     const height = 600;
//     const left = window.screen.width / 2 - width / 2;
//     const top = window.screen.height / 2 - height / 2;

//     setLoading(true);

//     window.open(
//       import.meta.env.VITE_GOOGLE_AUTH_URL,
//       "Google Login",
//       `width=${width},height=${height},top=${top},left=${left}`
//     );
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-tl from-green-900 to-gray-900 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.9, ease: "easeInOut" }}
//         className="flex items-center justify-start gap-x-2 mb-8"
//       >
//         <div className="w-24 h-24">
//           <img
//             src="/funaab.png"
//             alt="funaab"
//             className="object-contain w-full h-full"
//           />
//         </div>
//         <h2 className="text-2xl text-white font-bold">Smart Attendance</h2>
//       </motion.div>

//       <MotionCard
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.9, ease: "easeInOut" }}
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
//               disabled={loading}
//               className="w-full flex gap-2 cursor-pointer justify-center text-black items-center bg-slate-200 hover:bg-slate-300 transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <img
//                     src="https://www.svgrepo.com/show/355037/google.svg"
//                     alt="Google"
//                     className="w-5 h-5"
//                   />
//                   Continue with Google
//                 </>
//               )}
//             </Button>
//           </motion.div>
//         </CardContent>
//       </MotionCard>

//       <p className="text-center text-white mt-4">
//         &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
//         reserved.
//       </p>
//     </div>
//   );
// }

// export default Login;

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserLock, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/use-auth";
import { toast } from "sonner";

const MotionCard = motion.create(Card);

function Login() {
  const navigate = useNavigate();
  const d = new Date();
  const year = d.getFullYear();

  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Accept messages from your backend domain
      if (event.origin !== import.meta.env.VITE_BACKEND_URL) return;

      const { token } = event.data as { token?: string };

      // Handle authentication success
      if (token) {
        setLoading(true);

        try {
          // Check dashboard for onboarding status
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
          
          console.log("Dashboard response:", dashboardData);
          console.log("Onboarded status:", dashboardData.onboarded, typeof dashboardData.onboarded);
          
          // If user is onboarded, fetch full details and go to dashboard
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
            
            // Use context login method (it handles localStorage)
            login(userData, token);
            toast.success("Welcome back!");
            navigate("/");
            
          } else {
            // User not onboarded - go to onboarding
            localStorage.setItem("jwt_token", token);
            toast.success("Please complete your setup");
            navigate("/onboarding");
          }

        } catch (error) {
          console.error("Authentication failed:", error);
          toast.error("Authentication failed. Please try again.");
          localStorage.removeItem("jwt_token");
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, login]);

  const handleGoogleAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    setLoading(true);

    window.open(
      import.meta.env.VITE_GOOGLE_AUTH_URL,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-tl from-green-900 to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="flex items-center justify-start gap-x-2 mb-8"
      >
        <div className="w-24 h-24">
          <img
            src="/funaab.png"
            alt="funaab"
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-2xl text-white font-bold">Smart Attendance</h2>
      </motion.div>

      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
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
                  Signing in...
                </>
              ) : (
                <>
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </MotionCard>

      <p className="text-center text-white mt-4">
        &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
        reserved.
      </p>
    </div>
  );
}

export default Login;