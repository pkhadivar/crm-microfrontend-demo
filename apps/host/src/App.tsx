import { useState } from "react";

const App = () => {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          CRM Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setPage("dashboard")}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage("users")}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          >
            Users
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">{page.toUpperCase()}</header>

        <main className="p-6">
          {page === "dashboard" && <div>Dashboard Content</div>}
          {page === "users" && <div>Users Content</div>}
        </main>
      </div>
    </div>
  );
};

export default App;
