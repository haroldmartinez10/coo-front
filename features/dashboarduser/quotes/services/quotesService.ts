import { axiosInstance } from "@/services/axios";
import {
  QuoteBody,
  QuoteResponse,
  QuoteResponseCreate,
} from "@/features/dashboarduser/quotes/types/quotesTypes";

const quotesService = {
  getQuotes: async (): Promise<QuoteResponse> => {
    const response = await axiosInstance.get("/quotes");
    return response.data;
  },

  createQuote: async (quote: QuoteBody): Promise<QuoteResponseCreate> => {
    const response = await axiosInstance.post("/quotes", quote);
    return response.data;
  },
};

export default quotesService;
