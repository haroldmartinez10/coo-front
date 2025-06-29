type Error = {
  message: string;
};

export type MutationOptions<TData = unknown> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};
