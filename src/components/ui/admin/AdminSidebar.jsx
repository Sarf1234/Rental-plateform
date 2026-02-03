"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="p-5 border-b font-bold text-xl">
          Admin Panel
        </div>

        <nav className="p-4 space-y-2 text-gray-700">
          <Link href="/admin/dashboard" className="block p-2 rounded hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/admin/posts" className="block p-2 rounded hover:bg-gray-100">
            posts
          </Link>
          <Link href="/admin/businesses" className="block p-2 rounded hover:bg-gray-100">
            Businesses
          </Link>
          <Link href="/admin/cities" className="block p-2 rounded hover:bg-gray-100">
            Cities
          </Link>
          <Link href="/admin/products" className="block p-2 rounded hover:bg-gray-100">
            Products
          </Link>
          <Link href="/admin/products/categories" className="block p-2 rounded hover:bg-gray-100">
            Products Categories
          </Link>
          <Link href="/admin/products/tags" className="block p-2 rounded hover:bg-gray-100">
            Products Tags
          </Link>
          <Link href="/admin/services" className="block p-2 rounded hover:bg-gray-100">
            Services
          </Link>

          {/* Users */}
          {/* <div>
            <button
              onClick={() => toggleMenu("users")}
              className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100"
            >
              Users
              <ChevronDown size={18} />
            </button>

            {openMenu === "users" && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/admin/users"
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  All Users
                </Link>
                <Link
                  href="/admin/users/create"
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Create User
                </Link>
              </div>
            )}
          </div> */}

          {/* Products */}
          {/* <div>
            <button
              onClick={() => toggleMenu("products")}
              className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100"
            >
              Products
              <ChevronDown size={18} />
            </button>

            {openMenu === "products" && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/admin/products"
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  All Products
                </Link>
                <Link
                  href="/admin/products/create"
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Add Product
                </Link>
              </div>
            )}
          </div> */}
        </nav>
      </aside>
    </>
  );
}
