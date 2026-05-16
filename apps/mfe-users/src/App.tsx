import { users } from "./data/users";
import { useMemo, useState, useDeferredValue } from "react";
import { FixedSizeList } from "react-window";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { User } from "@crm/shared-types";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.original.role}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt,
  },
];

const App = () => {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const isSearching = search !== deferredSearch;
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

      return (
        fullName.includes(deferredSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(deferredSearch.toLowerCase())
      );
    });
  }, [deferredSearch]);
  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const row = table.getRowModel().rows[index];

    return (
      <div
        style={style}
        className="grid grid-cols-4 border-b border-gray-100 bg-white px-6 py-4 text-sm text-gray-700"
      >
        {row.getVisibleCells().map((cell) => (
          <div key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-100 p-8">
      <h1 className="mb-6 shrink-0 text-3xl font-bold text-gray-800">
        Users Management
      </h1>
      <div className="mb-6 shrink-0">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
        />
      </div>
      {isSearching && (
        <p className="mt-2 text-sm text-gray-500">Searching...</p>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Created At</div>
          </div>

          <FixedSizeList
            height={600}
            itemCount={filteredUsers.length}
            itemSize={60}
            width="100%"
          >
            {Row}
          </FixedSizeList>
        </div>
      </div>
    </div>
  );
};

export default App;
