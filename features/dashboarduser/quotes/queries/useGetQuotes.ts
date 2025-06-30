import { useQuery } from "@tanstack/react-query";
import quotesService from "../services/quoteServices";
import QUOTES_QUERY_KEYS from "@/features/dashboarduser/quotes/constants/quoteQueryKeys";

const useGetQuotes = () => {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEYS.QUOTES],
    queryFn: quotesService.getQuotes,
  });
};

export default useGetQuotes;
