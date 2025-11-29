import "../globals.css";

export const metadata = {
  title: "Admin Panel",
  description: "Admin routes",
};

export default function AdminLayout({ children }) {
  return <div className="admin-layout">{children}</div>;
}
