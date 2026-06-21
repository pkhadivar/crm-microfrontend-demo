import { useUsers } from "./features/users/hooks/useUsers";
import { QueryProvider } from "./providers/QueryProvider";
import { useMemo, useState, useDeferredValue } from "react";
import { FixedSizeList } from "react-window";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import type { User } from "@crm/shared-types";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "first_name",

    header: "Name",

    cell: ({ row }) => (
      <div>
        {row.original.first_name || "-"} {row.original.last_name || ""}
      </div>
    ),
  },

  {
    accessorKey: "email",

    header: "Email",

    cell: ({ row }) => (
      <div className="truncate" title={row.original.email}>
        {row.original.email}
      </div>
    ),
  },

  {
    accessorKey: "phone",

    header: "Phone",

    cell: ({ row }) => row.original.phone,
  },

  {
    accessorKey: "department",

    header: "Department",

    cell: ({ row }) => row.original.department?.name ?? "-",
  },

  {
    accessorKey: "roles",

    header: "Role",

    cell: ({ row }) => (
      <div
        className="truncate"
        title={row.original.roles?.map((r) => r.name).join(", ")}
      >
        {row.original.roles?.length
          ? row.original.roles.map((r) => r.name).join(", ")
          : "-"}
      </div>
    ),
  },

  {
    accessorKey: "is_active",

    header: "Status",

    cell: ({ row }) => (
      <span>{row.original.is_active ? "🟢 Active" : "🔴 Inactive"}</span>
    ),
  },

  {
    accessorKey: "created_at",

    header: "Created",

    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
];

const UsersApp = () => {
  const { data: users = [], isLoading, error } = useUsers();
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const deferredSearch = useDeferredValue(search);
  const isSearching = search !== deferredSearch;
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();

      return (
        fullName.includes(deferredSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(deferredSearch.toLowerCase())
      );
    });
  }, [users, deferredSearch]);
  const table = useReactTable({
    data: filteredUsers,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        className="grid grid-cols-7 border-b border-gray-100 bg-white px-6 py-4 text-sm text-gray-700"
      >
        {row.getVisibleCells().map((cell) => (
          <div
            key={cell.id}
            className="
          overflow-hidden
          whitespace-nowrap
          text-ellipsis
          px-2
        "
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    );
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users</div>;
  }
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
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700"
            >
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              ))}
            </div>
          ))}

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

const App = () => (
  <QueryProvider>
    <UsersApp />
  </QueryProvider>
);

export default App;
