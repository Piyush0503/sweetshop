import SweetTable from "../components/SweetTable";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Sweet Shop Management</h1>
        <SweetTable />
      </div>
    </main>
  );
}
