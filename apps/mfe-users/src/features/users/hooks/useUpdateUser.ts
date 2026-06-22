import {
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
import { updateUser } from "../api/users.api";
  
  
  type UpdateUserPayload = {
    id: number;
  
    data: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  
  export const useUpdateUser = () => {
    const queryClient =
      useQueryClient();
  
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: UpdateUserPayload) =>
        updateUser(
          id,
          data
        ),
  
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "users",
          ],
        });
      },
    });
  };