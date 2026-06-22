import type { User } from "@crm/shared-types";

const API_URL = "http://127.0.0.1:8000/api/users/";

type CreateUserPayload = {
  first_name: string;
  last_name: string;
  email: string;
};


export async function getUsers(): Promise<User[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function createUser(payload: CreateUserPayload) {
  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(
    `${API_URL}${id}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
}

