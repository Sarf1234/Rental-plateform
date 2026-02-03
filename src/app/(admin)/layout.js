"use client";

import { useState } from "react";
import AdminSidebar from "@/components/ui/admin/AdminSidebar";
import AdminNavbar from "@/components/ui/admin/AdminNavbar";
import "../globals.css";




export default function RootLayout({ children }) {

   const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
      </body>
    </html>
  );
}
