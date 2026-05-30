import { getUsers } from "./features/users/users.repository";
import { useState, useDeferredValue } from "react";
import { FixedSizeList } from "react-window";
import type {
  ColumnDef,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { User } from "@crm/shared-types";

const columns: ColumnDef<User>[] = [
  {
    id: "select",

    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),

    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
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
const gridTemplate = "60px 1.2fr 1.5fr 1fr 1fr";
const App = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const deferredFilter = useDeferredValue(globalFilter);
  const isSearching = globalFilter !== deferredFilter;

  const table = useReactTable({
    data: getUsers(),
    columns,

    state: {
      sorting,
      globalFilter: deferredFilter,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        className="border-b border-gray-100 bg-white px-6 py-4 text-sm text-gray-700"
        style={{
          ...style,
          display: "grid",
          gridTemplateColumns: gridTemplate,
        }}
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
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
        />
      </div>
      {isSearching && (
        <p className="mt-2 text-sm text-gray-500">Searching...</p>
      )}
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="mb-4 rounded-xl bg-blue-100 px-4 py-3 text-sm text-blue-700">
          {table.getSelectedRowModel().rows.length} users selected
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className="grid border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700"
              style={{
                gridTemplateColumns: gridTemplate,
              }}
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
            itemCount={table.getRowModel().rows.length}
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
