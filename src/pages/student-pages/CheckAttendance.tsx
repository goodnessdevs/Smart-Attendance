// import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const course = {
    name: "Introduction to Computer Science",
    code: "CSC 101",
    lecturer: "Prof. John David",
    time: "2:00 PM - 4:00 PM",
    location: "Computer Lab 2",
  }

function CheckAttendance() {
//   const { courseId } = useParams();
//   const courseKey = courseId?.toLowerCase();
//   const course = mockCourseData[courseKey];

  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleMarkAttendance = () => {
    // In a real app, send a request to your backend here
    setAttendanceMarked(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top on page load
  }, []);

//   if (!course) {
//     return (
//       <div className="p-4 text-center text-red-500 font-semibold">
//         Course not found 😕
//       </div>
//     );
//   }

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-2 text-primary">{course.name}</h2>
      <p className="dark:text-gray-400 text-gray-700 text-2xs mb-6 font-semibold">{course.code}</p>

      <div className="bg-accent rounded-xl p-5 shadow-md space-y-4">
        <p>
          <span className="font-medium">Lecturer:</span> {course.lecturer}
        </p>
        <p>
          <span className="font-medium">Time:</span> {course.time}
        </p>
        <p>
          <span className="font-medium">Location:</span> {course.location}
        </p>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {new Date().toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          {attendanceMarked ? (
            <span className="text-green-600 font-bold">Marked</span>
          ) : (
            <span className="text-yellow-600">Pending</span>
          )}
        </p>

        {!attendanceMarked && (
          <button
            onClick={handleMarkAttendance}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200"
          >
            Mark Attendance
          </button>
        )}

        {attendanceMarked && (
          <motion.div
            className="mt-6 text-center text-green-700 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Your attendance has been marked successfully!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default CheckAttendance;
