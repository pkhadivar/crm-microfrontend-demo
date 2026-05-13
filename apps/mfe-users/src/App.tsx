import { Table } from "@crm/ui";
import { users } from "./data/users";

const App = () => {
  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-100 p-8">
      <h1 className="mb-6 shrink-0 text-3xl font-bold text-gray-800">
        Users Management
      </h1>
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white">
        <Table headers={["Name", "Email", "Role", "Created At"]}>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>

              <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                {user.role}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {user.createdAt}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default App;
