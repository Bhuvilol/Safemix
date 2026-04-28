import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F7F5] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
