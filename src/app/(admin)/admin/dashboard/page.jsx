import React from "react";

export const dynamic = "force-dynamic";
export const ssr = false;

const Page = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome Back, Admin 👋
        </h1>
        <p className="mt-2 text-sm opacity-90">
          Here’s what’s happening in your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold mt-2">1,245</h2>
          <p className="text-green-500 text-sm mt-1">+12% this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold mt-2">320</h2>
          <p className="text-green-500 text-sm mt-1">+8% this week</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold mt-2">₹85,400</h2>
          <p className="text-red-500 text-sm mt-1">-3% today</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Pending Requests</p>
          <h2 className="text-2xl font-bold mt-2">18</h2>
          <p className="text-yellow-500 text-sm mt-1">Needs attention</p>
        </div>
      </div>

      {/* Recent Orders + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3">#1024</td>
                  <td>Rahul Kumar</td>
                  <td>₹2,500</td>
                  <td>
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Completed
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3">#1023</td>
                  <td>Priya Sharma</td>
                  <td>₹1,200</td>
                  <td>
                    <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3">#1022</td>
                  <td>Amit Singh</td>
                  <td>₹3,800</td>
                  <td>
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      Cancelled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-4 text-sm">
            <div className="border-l-4 border-indigo-500 pl-3">
              <p className="font-medium">New user registered</p>
              <p className="text-gray-500 text-xs">2 minutes ago</p>
            </div>

            <div className="border-l-4 border-green-500 pl-3">
              <p className="font-medium">Order #1024 completed</p>
              <p className="text-gray-500 text-xs">10 minutes ago</p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-3">
              <p className="font-medium">Payment pending</p>
              <p className="text-gray-500 text-xs">1 hour ago</p>
            </div>

            <div className="border-l-4 border-red-500 pl-3">
              <p className="font-medium">Server restart required</p>
              <p className="text-gray-500 text-xs">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
