import { axiosInstance } from "@/services/axios";

import {
  OrderBody,
  OrderResponse,
  OrderResponseCreate,
  OrderStatusHistoryBody,
  OrderStatusHistoryResponse,
  OrderTrackingResponse,
} from "@/features/dashboarduser/orders/types/orderTypes";

const orderServices = {
  getOrders: async (): Promise<OrderResponse> => {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },

  createOrder: async (order: OrderBody): Promise<OrderResponseCreate> => {
    const response = await axiosInstance.post("/orders", order);
    return response.data;
  },

  orderHistoryById: async (id: string): Promise<OrderStatusHistoryResponse> => {
    const response = await axiosInstance.get(`/orders/${id}/status-history`);
    return response.data;
  },

  changeStatusOrder: async (
    id: string,
    body: OrderStatusHistoryBody
  ): Promise<OrderStatusHistoryResponse> => {
    const response = await axiosInstance.put(`/orders/${id}/status`, {
      body,
    });
    return response.data;
  },

  orderTracking: async (
    trackingCode: string
  ): Promise<OrderTrackingResponse> => {
    const response = await axiosInstance.get(
      `/orders/tracking/${trackingCode}`
    );
    return response.data;
  },
};

export default orderServices;
