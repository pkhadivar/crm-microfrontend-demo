import type { User } from "@crm/shared-types";

const API_URL = "http://127.0.0.1:8000/api/users/";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}