import { useQuery } from "@tanstack/react-query";

import orderServices from "@/features/dashboarduser/orders/services/orderServices";
import ORDER_QUERY_KEYS from "../constants/OrderQueryKeys";

const useGetOrderTracking = (trackingCode: string) => {
  return useQuery({
    queryKey: [ORDER_QUERY_KEYS.ORDER_TRACKING],
    queryFn: () => orderServices.orderTracking(trackingCode),

    enabled: !!trackingCode,
    refetchInterval: 5000,
  });
};

export default useGetOrderTracking;
