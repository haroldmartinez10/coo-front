export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export interface Order {
  id: number;
  userId: number;
  originCity: string;
  destinationCity: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  basePrice: number;
  trackingCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderBody {
  originCity: string;
  destinationCity: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  basePrice: number;
}

export interface OrderResponseCreate {
  success: true;
  message: "Orden de envío creada exitosamente";
  data: {
    id: number;
    userId: number;
    originCity: string;
    destinationCity: string;
    weight: number;
    height: number;
    width: number;
    length: number;
    basePrice: number;
    trackingCode: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type OrderStatusHistory = {
  id: number;
  status: string;
  changed_at: string;
  notes: string;
};

export type OrderStatus = "pending" | "in_transit" | "delivered";

export type OrderStatusHistoryBody = {
  status: OrderStatus;
  notes: string;
};

export type OrderStatusHistoryResponse = {
  success: boolean;
  message: string;
  data: {
    order: {
      id: number;
      userId: number;
      originCity: string;
      destinationCity: string;
      weight: number;
      height: number;
      width: number;
      length: number;
      basePrice: number;
      trackingCode: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    statusHistory: OrderStatusHistory[];
  };
};

export type OrderTracking = {
  id: number;
  originCity: string;
  destinationCity: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  basePrice: number;
  trackingCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistory[];
};

export type OrderTrackingResponse = {
  success: boolean;
  message: string;
  data: OrderTracking;
};
