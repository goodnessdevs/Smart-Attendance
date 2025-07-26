import { motion } from "framer-motion";
import TableComp from "../components/TimeTable";

function Dashboard() {
  return (
    <div className="px-4 md:mx-4">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl font-semibold mb-6 md:mt-2 mt-14"
      >
        Welcome back, <span className="text-chart-2">@user</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-center font-semibold p-4 mt-10 bg-accent shadow-lg rounded-2xl"
      >
        <TableComp />
      </motion.div>
    </div>
  );
}

export default Dashboard;
