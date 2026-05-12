import type { User } from "@crm/shared-types";
import { Card } from "@crm/ui";

const users: User[] = [
  {
    id: "1",
    firstName: "Pouria",
    lastName: "Khadivar",
    email: "pouria@example.com",
    role: "admin",
    createdAt: "2026-05-09",
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    email: "j.doe@example.com",
    role: "manager",
    createdAt: "2026-05-09",
  },
];
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Users Management
      </h1>

      <div className="grid gap-4 mb-2">
        {users.map((user) => (
          <Card key={user.id} title={`${user.firstName} ${user.lastName}`}>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Created At: {user.createdAt}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;
