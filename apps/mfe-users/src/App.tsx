import { useUsers } from "./features/users/hooks/useUsers";
import { QueryProvider } from "./providers/QueryProvider";
import { useMemo, useState, useDeferredValue } from "react";
import { FixedSizeList } from "react-window";
import { Modal } from "./components/ui/Modal";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import type { User } from "@crm/shared-types";
import { useCreateUser } from "./features/users/hooks/useCreateUser";
import { useDeleteUser } from "./features/users/hooks/useDeleteUser";
import { useUpdateUser } from "./features/users/hooks/useUpdateUser";

const getColumns = (
  onDelete: (user: User) => void,
  onEdit: (user: User) => void
): ColumnDef<User>[] => [
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
  {
    id: "actions",

    header: "Actions",

    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="rounded bg-blue-600 px-3 py-1 text-white"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(row.original)}
          className="rounded bg-red-500 px-3 py-1 text-white"
        >
          Delete
        </button>
      </div>
    ),
  },
];
const UsersApp = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const emptyUser = {
    first_name: "",
    last_name: "",
    email: "",
  };

  const [formData, setFormData] = useState(emptyUser);
  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const deleteMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();
  const columns = useMemo(
    () =>
      getColumns(
        setSelectedUser,

        (user) => {
          setEditingUser(user);

          setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          });

          setIsCreateOpen(true);
        }
      ),

    []
  );

  const resetForm = () => {
    setFormData(emptyUser);
    setEditingUser(null);
    setIsCreateOpen(false);
  };

  const handleCreateUser = async () => {
    await createUserMutation.mutateAsync(formData);

    resetForm();
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    await updateUserMutation.mutateAsync({
      id: editingUser.id,
      data: formData,
    });

    resetForm();
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await handleUpdateUser();
      } else {
        await handleCreateUser();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteMutation.mutateAsync(selectedUser.id);

      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    }
  };
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
        className="grid grid-cols-8 border-b border-gray-100 bg-white px-6 py-4 text-sm text-gray-700"
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
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
        />

        <button
          onClick={() => {
            setEditingUser(null);

            setFormData(emptyUser);

            setIsCreateOpen(true);
          }}
          className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>
      {isSearching && (
        <p className="mt-2 text-sm text-gray-500">Searching...</p>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700"
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
      <Modal
        open={isCreateOpen}
        title={editingUser ? "Update User" : "Create User"}
        onClose={() => setIsCreateOpen(false)}
      >
        <div className="space-y-4">
          <input
            value={formData.first_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                first_name: e.target.value,
              })
            }
            placeholder="First Name"
            className="w-full rounded border p-3"
          />

          <input
            value={formData.last_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                last_name: e.target.value,
              })
            }
            placeholder="Last Name"
            className="w-full rounded border p-3"
          />

          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            placeholder="Email"
            className="w-full rounded border p-3"
          />

          <button
            onClick={handleSubmit}
            disabled={createUserMutation.isPending}
            className="w-full rounded bg-blue-600 p-3 text-white disabled:opacity-50"
          >
            {editingUser ? "Update User" : "Create User"}
          </button>
        </div>
      </Modal>
      <Modal
        open={!!selectedUser}
        title="Delete User"
        onClose={() => setSelectedUser(null)}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this user?
          </p>

          <div className="rounded-lg bg-gray-100 px-4 py-3 break-all text-sm font-medium text-gray-800">
            {selectedUser?.email}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedUser(null)}
              className="flex-1 rounded border p-3"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 rounded bg-red-600 p-3 text-white disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const App = () => (
  <QueryProvider>
    <UsersApp />
  </QueryProvider>
);

export default App;
