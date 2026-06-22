import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUser } from "../api/users.api";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}