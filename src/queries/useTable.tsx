import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import tableApiRequest from "src/apiRequests/table";
import { UpdateTableBodyType } from "src/schemaValidations/table.schema";

export const useTableListQuery = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequest.list,
  });
};
export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};
export const useTableQueryById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled,
  });
};
export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
        exact: true,
      });
    },
  });
};
export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};
