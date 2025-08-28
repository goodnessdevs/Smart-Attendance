 # Smart Attendance

 Smart Attendance is a modern web application designed to streamline and digitize the process of tracking student attendance in academic institutions. Built with React, TypeScript, and Vite, it provides a seamless experience for both students and lecturers, supporting features like course selection, attendance marking, admin management, and responsive design for all devices.

 ## Features

 - 📋 **Student Attendance Tracking**: Students can view their attendance records, see summaries, and mark attendance for their courses.
 - 🧑‍🏫 **Lecturer/Admin Dashboard**: Admins can log in securely, select and manage courses, and track attendance for each course.
 - 🔍 **Course Search & Selection**: Easily search and select courses to manage or mark attendance.
 - ✅ **Mark Attendance**: Mark attendance with a single click, with visual feedback and confetti animation for success.
 - 📅 **Academic Calendar**: View the academic session calendar with important dates and activities.
 - 📱 **Mobile-First & Responsive**: Fully responsive UI for mobile, tablet, and desktop users.
 - 🔒 **Secure Admin Access**: Admin authentication with password protection (for demo; use a secure backend in production).
 - 🌐 **Location Access**: Optionally require location access for marking attendance (for added verification).

 ## Tech Stack

 - **Frontend**: React, TypeScript, Vite
 - **Styling**: Tailwind CSS
 - **State Management**: React Hooks
 - **UI Components**: Custom and reusable components (Card, Table, Badge, Checkbox, etc.)
 - **Animation**: Framer Motion, Canvas Confetti
 - **Notifications**: Sonner

 ## Getting Started

 ### Prerequisites
 - Node.js (v18 or later recommended)
 - pnpm (or npm/yarn)

 ### Installation

 ```bash
 # Clone the repository
 git clone https://github.com/goodnessdevs/Smart-Attendance.git
 cd attendance-app

 # Install dependencies
 pnpm install
 # or
 yarn install
 # or
 npm install
 ```

 ### Running the App

 ```bash
 pnpm dev
 # or
 yarn dev
 # or
 npm run dev
 ```

 The app will be available at `http://localhost:5173` (or the port shown in your terminal).

 ## Project Structure

 ```
 attendance-app/
 ├── public/                # Static assets
 ├── src/
 │   ├── assets/            # Images and icons
 │   ├── components/        # Reusable UI components
 │   ├── hooks/             # Custom React hooks
 │   ├── lib/               # Utility functions
 │   ├── pages/             # Main app pages (Dashboard, Account, Calendar, etc.)
 │   └── types/             # TypeScript type definitions
 ├── package.json
 ├── tsconfig.json
 ├── vite.config.ts
 └── ...
 ```

 ## Usage

 - **Students**: Log in, view your attendance, and mark attendance for your courses.
 - **Lecturers/Admins**: Log in via the admin portal, select courses, and manage attendance records.
 - **Mobile Users**: Enjoy a fully responsive experience on your phone or tablet.

 ## Customization
 - Update course lists, authentication, and attendance logic as needed for your institution.
 - For production, connect to a secure backend and database for persistent data.

 ## Contributing
 Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

 ## License
 [MIT](LICENSE)

 ---

 > Made with ❤️ by GoodnessDevs
