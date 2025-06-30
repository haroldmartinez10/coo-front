import { useQuery } from "@tanstack/react-query";

import orderServices from "@/features/dashboarduser/orders/services/orderServices";
import ORDER_QUERY_KEYS from "../constants/OrderQueryKeys";

const useGetHistoryById = (id: string) => {
  return useQuery({
    queryKey: [ORDER_QUERY_KEYS.ORDER_BY_ID],
    queryFn: () => orderServices.orderHistoryById(id),
  });
};

export default useGetHistoryById;
