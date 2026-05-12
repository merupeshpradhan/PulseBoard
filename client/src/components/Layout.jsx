// App layout wrapper (Navbar + page container)

import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top navigation */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
