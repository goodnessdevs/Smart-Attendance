import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";
import { useAuthContext } from "../hooks/use-auth";
// import React from "react";

export const UserAvatar = () => {
  const { user } = useAuthContext();

  const getAvatarFallback = () => {
    if (!user?.fullName) return "U";
    const names = user.fullName.split(" ");
    return names
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join(" ");
  };

  const MotionAvatar = motion.create(Avatar);

  // React.useEffect(() => {
  //   console.log("Auth User:", user);
  // }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 150,
      }}
      className="float-right relative right-20 bottom-10 hidden md:flex items-center gap-x-2"
    >
      <span className="font-semibold">{user?.fullName}</span>
      <MotionAvatar
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.25 }}
        transition={{
          ease: "easeOut",
        }}
        className="w-12 h-12"
      >
        <AvatarImage src={user?.profilePic} alt="User Avatar" />
        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
      </MotionAvatar>
    </motion.div>
  );
};
