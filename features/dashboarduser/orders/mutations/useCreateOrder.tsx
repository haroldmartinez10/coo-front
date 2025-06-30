import { useMutation } from "@tanstack/react-query";

import { MutationOptions } from "@/shared/types/mutationTypes";

import orderServices from "../services/orderServices";
import { OrderBody } from "../types/orderTypes";

export const useCreateOrder = ({
  onSuccess,
  onError,
}: MutationOptions = {}) => {
  const mutation = useMutation({
    mutationFn: ({ body }: { body: OrderBody }) =>
      orderServices.createOrder(body),
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
    createOrder: mutate,
    createOrderAsync: mutateAsync,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
