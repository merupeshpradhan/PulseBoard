// App layout wrapper (Navbar + page container)

import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 transition-colors duration-500">
      <Toaster position="top-right" />

      {/* Top navigation */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 ">{children}</main>
    </div>
  );
};

export default Layout;
