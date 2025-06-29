import { useMutation } from "@tanstack/react-query";

import { MutationOptions } from "@/shared/types/mutationTypes";
import quotesService from "@/features/dashboarduser/quotes/services/quotesService";
import { QuoteBody } from "@/features/dashboarduser/quotes/types/quotesTypes";

export const useCreateQuote = ({
  onSuccess,
  onError,
}: MutationOptions = {}) => {
  const mutation = useMutation({
    mutationFn: ({ body }: { body: QuoteBody }) =>
      quotesService.createQuote(body),
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
    createQuote: mutate,
    createQuoteAsync: mutateAsync,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
