// Top navbar for navigation

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold">Poll Platform</h1>

      <div className="flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/create">Create Poll</Link>
      </div>
    </div>
  );
};

export default Navbar;
