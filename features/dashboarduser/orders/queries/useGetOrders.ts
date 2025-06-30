import { useQuery } from "@tanstack/react-query";

import orderServices from "@/features/dashboarduser/orders/services/orderServices";
import ORDER_QUERY_KEYS from "../constants/OrderQueryKeys";

const useGetOrders = () => {
  return useQuery({
    queryKey: [ORDER_QUERY_KEYS.ORDERS],
    queryFn: orderServices.getOrders,
  });
};

export default useGetOrders;
