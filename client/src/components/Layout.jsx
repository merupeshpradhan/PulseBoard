// App layout wrapper (Navbar + page container)

import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation */}
      <Navbar />

      {/* Page content */}
      <div className="max-w-5xl mx-auto p-4">{children}</div>
    </div>
  );
};

export default Layout;
