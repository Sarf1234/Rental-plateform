"use client";

import { Menu } from "lucide-react";

export default function AdminNavbar({ setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <button
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Admin</span>
        <div className="w-9 h-9 rounded-full bg-gray-300"></div>
      </div>
    </header>
  );
}
