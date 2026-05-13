import React, { useState, Suspense } from "react";

const UsersApp = React.lazy(() => import("users/App"));

const App = () => {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-gray-900 text-white">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          CRM Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setPage("dashboard")}
            className={`w-full rounded px-3 py-2 text-left transition-colors ${
              page === "dashboard"
                ? "bg-gray-700 font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage("users")}
            className={`w-full rounded px-3 py-2 text-left transition-colors ${
              page === "users"
                ? "bg-gray-700 font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            Users
          </button>
        </nav>
      </aside>

      <div className="ml-64 flex flex-1 flex-col">
        <header className="bg-white shadow p-4">{page.toUpperCase()}</header>

        <main className="flex h-[calc(100vh-64px)] min-h-0 flex-col p-6">
          {page === "dashboard" && <div>Dashboard Content</div>}
          {page === "users" && (
            <div className="min-h-0 flex-1">
              <Suspense fallback={<div>Loading Users...</div>}>
                <UsersApp />
              </Suspense>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
