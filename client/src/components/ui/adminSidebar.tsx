import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Add Doctor", path: "/admin/doctors/add" },
    { name: "Manage Doctors", path: "/admin/doctors/manage" },
    { name: "Manage Patients", path: "/admin/patients/manage" },
    { name: "Appointments", path: "/admin/appointments" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-5 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
