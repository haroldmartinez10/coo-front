import { useMutation } from "@tanstack/react-query";
import { MutationOptions } from "@/shared/types/mutationTypes";
import orderServices from "../services/orderServices";
import { OrderStatusHistoryBody } from "../types/orderTypes";

export const useUpdateStatusOrder = ({
  onSuccess,
  onError,
}: MutationOptions = {}) => {
  const mutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: OrderStatusHistoryBody }) =>
      orderServices.changeStatusOrder(id, body),
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });

  const { mutate, isPending, isSuccess, isError, error, mutateAsync } =
    mutation;

  return {
    updateStatusOrder: mutate,
    updateStatusOrderAsync: mutateAsync,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
