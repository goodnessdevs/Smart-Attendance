// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { UserLock } from "lucide-react";
// import {
//   getOrCreateUUID,
//   getBrowserFingerprint,
// } from "../utils/browserfingerprint";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// // import { Separator } from "../components/ui/separator";
// import { useEffect, useState } from "react";

// const MotionCard = motion.create(Card);

// function Login() {
//   // const navigate = useNavigate();
//   const d = new Date();
//   const year = d.getFullYear();

//   const [uuid, setUuid] = useState("");
//   const [fingerprint, setFingerprint] = useState("");

//   useEffect(() => {
//     async function initDevice() {
//       const deviceUUID = await getOrCreateUUID();
//       const browserFP = getBrowserFingerprint();

//       setUuid(deviceUUID);
//       setFingerprint(browserFP);

//       // Optionally send device info to backend for logging
//       fetch("http://localhost:4000/api/device-info", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           uuid: deviceUUID,
//           fingerprint: browserFP,
//         }),
//         credentials: "include",
//       });
//     }

//     initDevice();
//   }, []);

//   const handleGoogleAuth = () => {
//     // Google auth logic
//     // navigate("/onboarding");
//     window.location.href = import.meta.env.VITE_SERVER_URL;
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-br from-green-900 to-gray-900 px-4">
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
//         <h2 className="text-2xl text-white font-bold">Smart Attendance</h2>
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
//               Sign in with Google
//             </Button>
//           </motion.div>

//           {/* Debug info */}
//           <div className="mt-6 text-xs text-gray-500">
//             <p>UUID: {uuid}</p>
//             <p>Fingerprint: {fingerprint}</p>
//           </div>

//           {/* <Separator /> */}

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

//       <p className="text-center text-white mt-4">
//         &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
//         reserved.
//       </p>
//     </div>
//   );
// }

// export default Login;

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserLock } from "lucide-react";
import {
  getOrCreateUUID,
  getBrowserFingerprint,
} from "../utils/browserfingerprint";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";

const MotionCard = motion.create(Card);

function Login() {
  const navigate = useNavigate();
  const d = new Date();
  const year = d.getFullYear();

  const [uuid, setUuid] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  // const [loading, setLoading] = useState(false);

  // ✅ Device fingerprint
  useEffect(() => {
    async function initDevice() {
      const deviceUUID = await getOrCreateUUID();
      const browserFP = getBrowserFingerprint();

      setUuid(deviceUUID);
      setFingerprint(browserFP);

      // Optionally send device info to backend for logging
      fetch("http://localhost:4000/api/device-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: deviceUUID,
          fingerprint: browserFP,
        }),
        credentials: "include",
      });
    }

    initDevice();
  }, []);

  // ✅ Handle Google OAuth
  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth
    window.location.href = import.meta.env.VITE_SERVER_URL;
    // On render, your backend should redirect back with a token in query or cookie
  };

  // ✅ Check for JWT token in URL after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt_token", token);

      // Validate token immediately with backend
      fetch("http://localhost:4000/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User data:", data);

          // Redirect based on onboarded status
          if (data.onboarded) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          localStorage.removeItem("jwt_token");
        });
    }
  }, [navigate]);

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
              className="w-full flex gap-2 cursor-pointer justify-center text-black items-center bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              {/* {!loading ? ( */}
                <>Sign in with Google</>
              {/* ) : ( */}
                {/* <>
                  <Loader2 className="animate-spin w-4 h-4" /> Signing in...
                </>
              )} */}
            </Button>
          </motion.div>

          {/* Debug info */}
          <div className="mt-6 text-xs text-gray-500">
            <p>UUID: {uuid}</p>
            <p>Fingerprint: {fingerprint}</p>
          </div>

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
