"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useGetOrders from "@/features/dashboarduser/orders/queries/useGetOrders";
import OrdersTable from "./components/OrdersTable";
import { Order } from "./types/orderTypes";
import { useAppSelector } from "@/shared/hooks/reduxHooks";

const OrdersPage = () => {
  const state = useAppSelector((state) => state.auth);

  const token = state.token;

  const { data } = useGetOrders();
  const socketRef = useRef<Socket | null>(null);

  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (data?.data) {
      setAllOrders(data.data);
    }
  }, [data?.data]);

  useEffect(() => {
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("authenticate", token);
    });

    socket.on("room-joined", (response) => {
      response;
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor WebSocket");
    });

    socket.on("order-updated", (notification) => {
      const updatedOrder = notification.data;
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
        )
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return (
    <>
      <OrdersTable orders={allOrders} />
    </>
  );
};

export default OrdersPage;
