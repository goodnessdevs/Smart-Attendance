// // import { useState } from "react";
// // import { Button } from "../components/ui/button";
// // import { Input } from "../components/ui/input";
// // import { Textarea } from "../components/ui/textarea";
// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardContent,
// //   CardFooter,
// // } from "../components/ui/card";
// // import { Label } from "../components/ui/label";
// // import { Loader2, Plus, Trash2 } from "lucide-react";

// // export default function AdminCreateCourse() {
// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState<string | null>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   const [lecturers, setLecturers] = useState<string[]>([""]);

// //   // Handle dynamic field updates
// //   const handleChange = (
// //     index: number,
// //     value: string,
// //     type: "lecturer"
// //   ) => {
// //     if (type === "lecturer") {
// //       const updated = [...lecturers];
// //       updated[index] = value;
// //       setLecturers(updated);
// //     }
// //   };

// //   const handleAddField = (type: "lecturer" | "venue" | "day") => {
// //     if (type === "lecturer") setLecturers([...lecturers, ""]);
// //   };

// //   const handleRemoveField = (
// //     index: number,
// //     type: "lecturer" | "venue" | "day"
// //   ) => {
// //     if (type === "lecturer")
// //       setLecturers(lecturers.filter((_, i) => i !== index));
// //   };

// //   // Submit handler
// //   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
// //     e.preventDefault();
// //     setLoading(true);
// //     setSuccess(null);
// //     setError(null);

// //     const formData = new FormData(e.currentTarget);
// //     const courseData = {
// //       courseName: formData.get("courseName"),
// //       courseTitle: formData.get("courseTitle"),
// //       courseDescription: formData.get("courseDescription"),
// //       lecturers: lecturers.filter((l) => l.trim() !== ""),
// //       courseTime: formData.get("courseTime"),
// //       isActive: true,
// //     };

// //     try {
// //       const res = await fetch("/api/courses", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(courseData),
// //       });

// //       if (!res.ok) throw new Error("Failed to publish course");

// //       setSuccess("✅ Course created successfully!");
// //       e.currentTarget.reset();
// //       setLecturers([""]);
// //     } catch (err: unknown) {
// //       if (err instanceof Error) {
// //         setError(err.message);
// //       } else {
// //         setError("Something went wrong");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="p-6 max-w-4xl mx-auto">
// //       <Card className="shadow-xl border border-gray-200">
// //         <CardHeader>
// //           <CardTitle className="text-xl font-semibold">
// //             Create New Course
// //           </CardTitle>
// //         </CardHeader>

// //         <form onSubmit={handleSubmit}>
// //           <CardContent className="space-y-6">
// //             {/* Course Name */}
// //             <div>
// //               <Label htmlFor="courseName">Course Name</Label>
// //               <Input
// //                 id="courseName"
// //                 name="courseName"
// //                 placeholder="Enter course name"
// //                 required
// //               />
// //             </div>

// //             {/* Course Title */}
// //             <div>
// //               <Label htmlFor="courseTitle">Course Title</Label>
// //               <Input
// //                 id="courseTitle"
// //                 name="courseTitle"
// //                 placeholder="Enter course title"
// //                 required
// //               />
// //             </div>

// //             {/* Course Description */}
// //             <div>
// //               <Label htmlFor="courseDescription">Description</Label>
// //               <Textarea
// //                 id="courseDescription"
// //                 name="courseDescription"
// //                 placeholder="Enter course description"
// //                 required
// //               />
// //             </div>

// //             {/* Course Time */}
// //             <div>
// //               <Label htmlFor="courseTime">Course Time</Label>
// //               <Input id="courseTime" name="courseTime" type="time" required />
// //             </div>

// //             {/* Lecturers */}
// //             <div>
// //               <Label>Lecturers</Label>
// //               {lecturers.map((lecturer, i) => (
// //                 <div key={i} className="flex items-center gap-2 mt-2">
// //                   <Input
// //                     placeholder={`Lecturer ${i + 1}`}
// //                     value={lecturer}
// //                     onChange={(e) =>
// //                       handleChange(i, e.target.value, "lecturer")
// //                     }
// //                   />
// //                   <Button
// //                     type="button"
// //                     variant="destructive"
// //                     size="icon"
// //                     onClick={() => handleRemoveField(i, "lecturer")}
// //                     disabled={lecturers.length === 1}
// //                   >
// //                     <Trash2 className="w-4 h-4" />
// //                   </Button>
// //                 </div>
// //               ))}
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                 className="mt-2"
// //                 onClick={() => handleAddField("lecturer")}
// //               >
// //                 <Plus className="w-4 h-4 mr-1" /> Add Lecturer
// //               </Button>
// //             </div>
// //           </CardContent>

// //           <CardFooter className="flex justify-between items-center">
// //             {success && <p className="text-green-600">{success}</p>}
// //             {error && <p className="text-red-600">{error}</p>}

// //             <Button type="submit" disabled={loading}>
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
// //                   Publishing...
// //                 </>
// //               ) : (
// //                 "Publish Course"
// //               )}
// //             </Button>
// //           </CardFooter>
// //         </form>
// //       </Card>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { 
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "../components/ui/card";
// import { 
//   Loader2, 
//   Plus, 
//   Trash2, 
//   BookOpen, 
//   Users, 
//   Settings,
//   Bell,
//   User,
//   Menu,
//   X,
//   Home,
//   GraduationCap,
//   BarChart3
// } from "lucide-react";
// import { Label } from "../components/ui/label";

// export default function AdminDashboard() {
//   // Navigation state
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
  
//   // Form state
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [lecturers, setLecturers] = useState<string[]>([""]);

//   // Mock data for dashboard
//   const stats = [
//     { title: "Total Courses", value: "24", icon: BookOpen, trend: "+12%" }
//   ];

//   // Handle dynamic field updates
//   const handleChange = (index: number, value: string) => {
//     const updated = [...lecturers];
//     updated[index] = value;
//     setLecturers(updated);
//   };

//   const handleAddField = () => {
//     setLecturers([...lecturers, ""]);
//   };

//   const handleRemoveField = (index: number) => {
//     setLecturers(lecturers.filter((_, i) => i !== index));
//   };

//   // Submit handler
//   const handleSubmit = async () => {
//     setLoading(true);
//     setSuccess(null);
//     setError(null);

//     const courseData = {
//       courseName: (document.getElementById("courseName") as HTMLInputElement)?.value,
//       courseTitle: (document.getElementById("courseTitle") as HTMLInputElement)?.value,
//       courseDescription: (document.getElementById("courseDescription") as HTMLTextAreaElement)?.value,
//       lecturers: lecturers.filter((l) => l.trim() !== ""),
//       courseTime: (document.getElementById("courseTime") as HTMLInputElement)?.value,
//       credits: (document.getElementById("credits") as HTMLInputElement)?.value,
//       maxStudents: (document.getElementById("maxStudents") as HTMLInputElement)?.value,
//       isActive: true,
//     };

//     try {
//       const res = await fetch("/create-course", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(courseData),
//       });

//       if (!res.ok) throw new Error("Failed to publish course");
      
//       setSuccess("✅ Course created successfully!");
//       // Reset form
//       (document.getElementById("courseName") as HTMLInputElement).value = "";
//       (document.getElementById("courseTitle") as HTMLInputElement).value = "";
//       (document.getElementById("courseDescription") as HTMLTextAreaElement).value = "";
//       (document.getElementById("courseTime") as HTMLInputElement).value = "";
//       (document.getElementById("credits") as HTMLInputElement).value = "";
//       (document.getElementById("maxStudents") as HTMLInputElement).value = "";
//       setLecturers([""]);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Something went wrong");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigation = [
//     { id: "dashboard", label: "Dashboard", icon: Home },
//     { id: "courses", label: "Courses", icon: BookOpen },
//     { id: "create", label: "Create Course", icon: Plus },
//     { id: "students", label: "Students", icon: Users },
//     { id: "analytics", label: "Analytics", icon: BarChart3 },
//     { id: "settings", label: "Settings", icon: Settings }
//   ];

//   const renderLeftContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return (
//           <div className="space-y-6">
//             <div className="animate-fade-in">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
//               <p className="text-gray-600">Manage your educational platform</p>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 gap-6">
//               {stats.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="transform transition-all duration-300 hover:scale-105 animate-slide-up"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <Card className="hover:shadow-xl transition-shadow border-cyan-100 hover:border-cyan-200">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                           <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
//                           <p className="text-sm text-cyan-600 font-medium mt-1">{stat.trend}</p>
//                         </div>
//                         <div className="p-4 bg-cyan-50 rounded-full">
//                           <stat.icon className="w-8 h-8 text-cyan-600" />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}
//             </div>

//             {/* Welcome Card */}
//             <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
//               <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
//                 <CardContent className="p-8">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-cyan-100 rounded-full">
//                       <GraduationCap className="w-8 h-8 text-cyan-700" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">Welcome to EduAdmin</h3>
//                       <p className="text-gray-600 mt-1">Streamline your course management and enhance the learning experience.</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         );

//       case "create":
//         return (
//           <div className="space-y-6">
//             <div className="animate-fade-in">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
//               <p className="text-gray-600">Set up a new course for your educational platform</p>
//             </div>

//             <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
//               <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
//                 <CardContent className="p-8">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-cyan-100 rounded-full">
//                       <Plus className="w-8 h-8 text-cyan-700" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">Course Creation</h3>
//                       <p className="text-gray-600 mt-1">Fill out the form to create and publish a new course.</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <div className="space-y-6">
//             <div className="animate-fade-in">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {navigation.find(nav => nav.id === activeTab)?.label || "Page"}
//               </h1>
//             </div>
//             <Card className="animate-fade-in-up">
//               <CardContent className="p-6">
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                     {navigation.find(nav => nav.id === activeTab)?.icon && (
//                       <navigation.find(nav => nav.id === activeTab).icon className="w-8 h-8 text-cyan-600" />
//                     )}
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {navigation.find(nav => nav.id === activeTab)?.label}
//                   </h3>
//                   <p className="text-gray-600">This section is under development.</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );
//     }
//   };

//   const renderCreateForm = () => {
//     if (activeTab !== "create") return null;

//     return (
//       <div className="animate-slide-in-right">
//         <Card className="shadow-xl border border-cyan-200 hover:shadow-2xl transition-shadow duration-300">
//           <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
//             <CardTitle className="text-xl font-semibold flex items-center gap-2">
//               <Plus className="w-5 h-5" />
//               New Course Details
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-6 p-8">
//             <div className="grid grid-cols-1 gap-6">
//               {/* Course Name */}
//               <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
//                 <Label htmlFor="courseName" className="text-sm font-semibold">Course Code *</Label>
//                 <Input
//                   id="courseName"
//                   name="courseName"
//                   placeholder="e.g., CS101, MATH201"
//                   required
//                   className="mt-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                 />
//               </div>

//               {/* Course Title */}
//               <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
//                 <Label htmlFor="courseTitle" className="text-sm font-semibold">Course Title *</Label>
//                 <Input
//                   id="courseTitle"
//                   name="courseTitle"
//                   placeholder="Enter descriptive course title"
//                   required
//                   className="mt-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                 />
//               </div>

//               {/* Course Description */}
//               <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
//                 <Label htmlFor="courseDescription" className="text-sm font-semibold">Course Description *</Label>
//                 <Textarea
//                   id="courseDescription"
//                   name="courseDescription"
//                   placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
//                   required
//                   rows={4}
//                   className="mt-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Credits */}
//                 <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
//                   <Label htmlFor="credits" className="text-sm font-semibold">Credit Hours *</Label>
//                   <Input
//                     id="credits"
//                     name="credits"
//                     type="number"
//                     min="1"
//                     max="6"
//                     placeholder="3"
//                     required
//                     className="mt-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                   />
//                 </div>

//                 {/* Course Time */}
//                 <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
//                   <Label htmlFor="courseTime" className="text-sm font-semibold">Course Time *</Label>
//                   <Input 
//                     id="courseTime" 
//                     name="courseTime" 
//                     type="time" 
//                     required 
//                     className="mt-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                   />
//                 </div>
//               </div>

//               {/* Max Students */}
//               <div className="animate-fade-in" style={{ animationDelay: "350ms" }}>
//                 <Label htmlFor="maxStudents" className="text-sm font-semibold">Max Students</Label>
//                 <Input
//                   id="maxStudents"
//                   name="maxStudents"
//                   type="number"
//                   min="1"
//                   placeholder="50"
//                   className="mt-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                 />
//               </div>

//               {/* Lecturers */}
//               <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
//                 <Label className="text-sm font-semibold flex items-center gap-2">
//                   <Users className="w-4 h-4" />
//                   Lecturers *
//                 </Label>
//                 <div className="space-y-3 mt-2">
//                   {lecturers.map((lecturer, i) => (
//                     <div key={i} className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: `${450 + i * 50}ms` }}>
//                       <Input
//                         placeholder={`Lecturer ${i + 1}`}
//                         value={lecturer}
//                         onChange={(e) => handleChange(i, e.target.value)}
//                         className="flex-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                       />
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="icon"
//                         onClick={() => handleRemoveField(i)}
//                         disabled={lecturers.length === 1}
//                         className="shrink-0 hover:scale-105 transition-transform"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     className="w-full border-cyan-200 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200"
//                     onClick={handleAddField}
//                   >
//                     <Plus className="w-4 h-4 mr-1" /> Add Lecturer
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Status Messages */}
//             {success && (
//               <div className="animate-bounce-in">
//                 <Alert className="border-green-200 bg-green-50">
//                   <AlertDescription className="text-green-800">{success}</AlertDescription>
//                 </Alert>
//               </div>
//             )}
//             {error && (
//               <div className="animate-shake">
//                 <Alert className="border-red-200 bg-red-50">
//                   <AlertDescription className="text-red-800">{error}</AlertDescription>
//                 </Alert>
//               </div>
//             )}
//           </CardContent>

//           <CardFooter className="bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-6">
//             <div className="flex justify-between items-center w-full">
//               <Button type="button" variant="outline" className="border-cyan-200 text-cyan-600 hover:bg-cyan-50">
//                 Save as Draft
//               </Button>
//               <Button 
//                 onClick={handleSubmit} 
//                 disabled={loading} 
//                 className="min-w-[140px] bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-200 hover:scale-105"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Publishing...
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="w-4 h-4 mr-2" />
//                     Publish Course
//                   </>
//                 )}
//               </Button>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-xl transition-all duration-300 flex flex-col border-r border-cyan-100`}>
//         {/* Sidebar Header */}
//         <div className="p-4 border-b border-cyan-100">
//           <div className="flex items-center justify-between">
//             {sidebarOpen && (
//               <div className="flex items-center gap-2 animate-fade-in">
//                 <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
//                   <GraduationCap className="w-6 h-6 text-white" />
//                 </div>
//                 <span className="font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
//                   EduAdmin
//                 </span>
//               </div>
//             )}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-all duration-200"
//             >
//               {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </Button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <div className="space-y-2">
//             {navigation.map((item, index) => (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
//                   activeTab === item.id
//                     ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-200 shadow-sm'
//                     : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
//                 }`}
//                 style={{ animationDelay: `${index * 50}ms` }}
//               >
//                 <item.icon className="w-5 h-5" />
//                 {sidebarOpen && <span className="font-medium">{item.label}</span>}
//               </button>
//             ))}
//           </div>
//         </nav>

//         {/* User Profile */}
//         <div className="p-4 border-t border-cyan-100">
//           <div className="flex items-center gap-3 hover:bg-cyan-50 p-2 rounded-lg transition-colors cursor-pointer">
//             <div className="p-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full">
//               <User className="w-5 h-5 text-cyan-600" />
//             </div>
//             {sidebarOpen && (
//               <div className="animate-fade-in">
//                 <p className="font-semibold text-sm text-gray-900">Admin User</p>
//                 <p className="text-xs text-gray-600">admin@university.edu</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <div className="bg-white shadow-sm border-b border-cyan-100 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 {navigation.find(nav => nav.id === activeTab)?.label || "Dashboard"}
//               </h2>
//             </div>
//             <div className="flex items-center gap-4">
//               <Button variant="outline" size="icon" className="border-cyan-200 hover:bg-cyan-50">
//                 <Bell className="w-4 h-4 text-cyan-600" />
//               </Button>
//               <span className="text-sm text-gray-600">
//                 {new Date().toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Page Content */}
//         <div className="flex-1 overflow-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 h-full">
//             {/* Left Side - Dashboard Content */}
//             <div className="p-6 overflow-auto">
//               {renderLeftContent()}
//             </div>

//             {/* Right Side - Create Form */}
//             <div className="p-6 overflow-auto bg-gray-50 border-l border-cyan-100">
//               {renderCreateForm()}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Custom CSS for animations
//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes fade-in-up {
//           from { 
//             opacity: 0; 
//             transform: translateY(20px); 
//           }
//           to { 
//             opacity: 1; 
//             transform: translateY(0); 
//           }
//         }

//         @keyframes slide-up {
//           from { 
//             opacity: 0; 
//             transform: translateY(30px); 
//           }
//           to { 
//             opacity: 1; 
//             transform: translateY(0); 
//           }
//         }

//         @keyframes slide-in-right {
//           from { 
//             opacity: 0; 
//             transform: translateX(30px); 
//           }
//           to { 
//             opacity: 1; 
//             transform: translateX(0); 
//           }
//         }

//         @keyframes slide-in-left {
//           from { 
//             opacity: 0; 
//             transform: translateX(-20px); 
//           }
//           to { 
//             opacity: 1; 
//             transform: translateX(0); 
//           }
//         }

//         @keyframes bounce-in {
//           0% { 
//             opacity: 0; 
//             transform: scale(0.3); 
//           }
//           50% { 
//             opacity: 1; 
//             transform: scale(1.05); 
//           }
//           70% { 
//             transform: scale(0.9); 
//           }
//           100% { 
//             opacity: 1; 
//             transform: scale(1); 
//           }
//         }

//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out forwards;
//         }

//         .animate-fade-in-up {
//           animation: fade-in-up 0.6s ease-out forwards;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.6s ease-out forwards;
//           opacity: 0;
//         }

//         .animate-slide-in-right {
//           animation: slide-in-right 0.6s ease-out forwards;
//         }

//         .animate-slide-in-left {
//           animation: slide-in-left 0.4s ease-out forwards;
//           opacity: 0;
//         }

//         .animate-bounce-in {
//           animation: bounce-in 0.6s ease-out forwards;
//         }

//         .animate-shake {
//           animation: shake 0.6s ease-out forwards;
//         }
//       `}</style> */}
//     </div>
//   );
// }